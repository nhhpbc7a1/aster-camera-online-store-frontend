import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/core/auth/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const refreshUserProfile = async (baseUser) => {
        try {
            // For now, rely on JWT/localStorage; API `/users/:id` is not available.
            if (baseUser) {
                setUser(baseUser);
                localStorage.setItem('userInfo', JSON.stringify(baseUser));
            }
        } catch (_) {
            // no-op
        }
    };

    const isTokenExpired = (token) => {
        try {
            const payload = jwtDecode(token);
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return true;
        }
    };

    // Re-hydrate from localStorage (useful for OAuth callback flows)
    const hydrateFromStorage = () => {
        try {
            setLoading(true);

            const token = authService.getAuthToken();
            const userInfo = authService.getCurrentUser();

            if (token && userInfo && !isTokenExpired(token)) {
                const payload = jwtDecode(token);
                const rolesFromToken = Array.isArray(payload?.roles) ? payload.roles : [];

                // Ensure roles array exists
                let finalRoles = [];
                if (userInfo.roles && Array.isArray(userInfo.roles) && userInfo.roles.length > 0) {
                    finalRoles = userInfo.roles;
                } else if (userInfo.role && typeof userInfo.role === 'string') {
                    finalRoles = [userInfo.role];
                } else if (rolesFromToken.length > 0) {
                    finalRoles = rolesFromToken;
                }

                const merged = {
                    ...userInfo,
                    roles: finalRoles
                };

                setUser(merged);
                setIsAuthenticated(true);

                refreshUserProfile(merged);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error hydrating auth:", error);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };


    // Initialize auth state on app load
    useEffect(() => {
        hydrateFromStorage();
        const initAuth = () => {
            try {
                const token = authService.getAuthToken();
                const userInfo = authService.getCurrentUser();
                if (token && userInfo && !isTokenExpired(token)) {
                    setUser(userInfo);
                    setIsAuthenticated(true);
                    refreshUserProfile(userInfo);
                } else {
                    // No access token but refresh token exists → try silent refresh
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!token && refreshToken) {
                        (async () => {
                            try {
                                const resp = await authService.apiCall('/users/refresh-token', {
                                    method: 'POST',
                                    data: { refreshToken }
                                });
                                if (resp?.isSuccess && resp?.data?.accessToken) {
                                    localStorage.setItem('authToken', resp.data.accessToken);
                                    if (resp.data.refreshToken) localStorage.setItem('refreshToken', resp.data.refreshToken);
                                    const payload = jwtDecode(resp.data.accessToken);
                                    const rolesFromToken = Array.isArray(payload?.roles) ? payload.roles : [];
                                    const hydrated = userInfo ? { ...userInfo, roles: userInfo.roles?.length ? userInfo.roles : rolesFromToken } : {
                                        userId: payload?.sub,
                                        email: payload?.email,
                                        username: payload?.username || payload?.email,
                                        roles: rolesFromToken,
                                        profile: {}
                                    };
                                    setUser(hydrated);
                                    setIsAuthenticated(true);
                                    localStorage.setItem('userInfo', JSON.stringify(hydrated));
                                }
                            } catch (_) {
                                // ignore; user will be treated as logged out
                            } finally {
                                setLoading(false);
                            }
                        })();
                        return; // prevent finally at end from double-setting
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);

            if (response.success) {
                // Map new response shape and include roles decoded from JWT
                const accessTokenFromResp = response.data?.accessToken || authService.getAuthToken();
                const jwtPayload = authService.decodeJwt(accessTokenFromResp);
                const rolesFromToken = Array.isArray(jwtPayload?.roles) ? jwtPayload.roles : [];
                let userInfo = (() => {
                    if (response.data?.users) {
                        const u = response.data.users;
                        return { userId: u.id, email: u.email, username: u.fullname || u.email, roles: rolesFromToken, profile: {} };
                    }
                    const u = response.data?.user;
                    return u ? { ...u, roles: rolesFromToken } : u;
                })();
                if (!userInfo) userInfo = authService.getCurrentUser();

                console.log('AuthContext - Setting user after login:', userInfo);
                setUser(userInfo);
                setIsAuthenticated(true);
                // do not block UI
                refreshUserProfile(userInfo);

                // Load business profile if user is SELLER or SUPPLIER
                if (userInfo && (rolesFromToken.includes('SELLER') || rolesFromToken.includes('SUPPLIER'))) {
                    const userId = userInfo.userId || userInfo.id || jwtPayload?.sub;
                    if (userId) {
                        // Load business profile in background
                        authService.getBusinessProfile(userId).then((bpResponse) => {
                            if (bpResponse.success && bpResponse.data?.businessProfile) {
                                const updatedUser = {
                                    ...userInfo,
                                    businessProfile: bpResponse.data.businessProfile
                                };
                                setUser(updatedUser);
                                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                            }
                        }).catch(err => {
                            console.error('Failed to load business profile after login:', err);
                        });
                    }
                }

                return { success: true, message: response.message, user: userInfo };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: error.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    // Register function (starts OTP flow)
    const register = async (username, email, password, profile = {}, roleName = 'CUSTOMER') => {
        setLoading(true);
        try {
            const response = await authService.register(username, email, password, profile, roleName);
            return response;
        } catch (error) {
            return { success: false, message: error.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and complete registration
    const verifySignupOtp = async (tokenId, otp) => {
        setLoading(true);
        try {
            const response = await authService.verifySignupOtp(tokenId, otp);
            if (response.success) {
                // Auto-login after successful verification
                const userInfo = authService.getCurrentUser();
                if (userInfo) {
                    setUser(userInfo);
                    setIsAuthenticated(true);
                }
            }
            return response;
        } catch (error) {
            return { success: false, message: error.message || 'OTP verification failed' };
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const resendOtp = async (tokenId) => {
        setLoading(true);
        try {
            const response = await authService.resendOtp(tokenId);
            return response;
        } catch (error) {
            return { success: false, message: error.message || 'Failed to resend OTP' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update profile function
    const updateProfile = async (profile) => {
        if (!user) return { success: false, message: 'User not authenticated' };

        setLoading(true);
        try {
            const response = await authService.updateProfile(profile);

            if (response.success) {
                // Update local user state
                const updatedUser = { ...user, profile: { ...user.profile, ...profile } };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }

            return response;
        } catch (error) {
            return { success: false, message: error.message || 'Profile update failed' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        hydrateFromStorage,
        login,
        register,
        verifySignupOtp,
        resendOtp,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
