// Auth Service - Xử lý tất cả các API calls liên quan đến authentication
import apiClient, { handleApiError } from '../api/apiClient';

class AuthService {
    // Decode JWT payload safely (supports base64url)
    decodeJwt(token) {
        try {
            const payload = token?.split?.('.')[1];
            if (!payload) return null;
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 0)) % 4, '=');
            const json = decodeURIComponent(escape(atob(padded)));
            return JSON.parse(json);
        } catch {
            return null;
        }
    }
    // Helper method để gọi API với Axios
    async apiCall(endpoint, options = {}) {
        try {
            const response = await apiClient({
                url: endpoint,
                ...options
            });

            return response.data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            console.log('API Call: POST /users/login', { email, password: '***' });

            const response = await this.apiCall('/users/login', {
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });
            console.log('API Response:', response);

            if (response?.isSuccess && response?.data) {
                const accessToken = response.accessToken;
                const refreshToken = response.refreshToken;
                const minimalUser = response.data.user;

                console.log('Login successful, storing tokens and user info.', { accessToken, refreshToken, minimalUser });

                if (accessToken) localStorage.setItem('authToken', accessToken);
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

                if (minimalUser) {
                    const jwtPayload = this.decodeJwt(accessToken);
                    const rolesFromToken = Array.isArray(jwtPayload?.roles) ? jwtPayload.roles : [];
                    const userInfo = {
                        userId: minimalUser.id || jwtPayload?.sub,
                        email: minimalUser.email,
                        username: minimalUser.fullname || minimalUser.email,
                        profile: {},
                        roles: rolesFromToken,
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
            }

            // Normalize for components expecting `success`
            return {
                success: !!response?.isSuccess,
                data: response?.data ?? null,
                error: response?.error ?? null,
                message: response?.error?.message ?? undefined,
            };
        } catch (error) {
            console.error('🚨 API Error:', error);
            return handleApiError(error);
        }
    }

    // Start registration process (sends OTP email)
    async register(username, email, password, profile = {}, roleName = 'CUSTOMER') {
        try {
            console.log('API Call: POST /users/signup-pending', { username, email, roleName });

            const response = await this.apiCall('/users/signup-pending', {
                method: 'POST',
                data: {
                    username,
                    email,
                    password,
                    profile,
                    roleName
                }
            });

            console.log('API Response:', response);

            // Normalize for components expecting `success`
            return {
                success: !!response?.isSuccess,
                data: response?.data ?? null,
                error: response?.error ?? null,
                message: response?.data?.message ?? 'Verification email sent successfully',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Verify OTP and complete registration
    async verifySignupOtp(tokenId, otp) {
        try {
            console.log('API Call: POST /users/verify-signup-otp', { tokenId, otp: '***' });

            const response = await this.apiCall('/users/verify-signup-otp', {
                method: 'POST',
                data: {
                    tokenId,
                    otp
                }
            });

            console.log('API Response:', response);

            if (response?.isSuccess && response?.data) {
                const accessToken = response.accessToken;
                const refreshToken = response.refreshToken;
                const minimalUser = response.data.user;

                // Auto-login after successful verification
                if (accessToken) localStorage.setItem('authToken', accessToken);
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

                if (minimalUser) {
                    const jwtPayload = this.decodeJwt(accessToken);
                    const rolesFromToken = Array.isArray(jwtPayload?.roles) ? jwtPayload.roles : [];
                    const userInfo = {
                        userId: minimalUser.id || jwtPayload?.sub,
                        email: minimalUser.email,
                        username: minimalUser.fullname || minimalUser.email,
                        profile: response.data.profile || {},
                        roles: rolesFromToken,
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
            }

            return {
                success: !!response?.isSuccess,
                data: response?.data ?? null,
                error: response?.error ?? null,
                message: response?.data?.message ?? 'Registration completed successfully',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Resend OTP
    async resendOtp(tokenId) {
        try {
            console.log('API Call: POST /users/signup-pending/resend-otp', { tokenId });

            const response = await this.apiCall('/users/signup-pending/resend-otp', {
                method: 'POST',
                data: {
                    tokenId
                }
            });

            console.log('API Response:', response);

            return {
                success: !!response?.isSuccess,
                data: response?.data ?? null,
                error: response?.error ?? null,
                message: response?.data?.message ?? 'OTP resent successfully',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }


    // Update user profile
    async updateProfile(profile) {
        try {
            console.log('API Call: POST /users/update-profile', { profile, type: typeof profile, isObject: typeof profile === 'object' });

            const response = await this.apiCall('/users/update-profile', {
                method: 'POST',
                data: { profile }
            });

            console.log('API Response:', response);

            if (response?.isSuccess && response?.data) {
                // Update local user info
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        profile: { ...currentUser.profile, ...JSON.parse(response.data.profile) }
                    };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                }
            }

            return {
                success: !!response?.isSuccess,
                data: response?.data ?? null,
                error: response?.error ?? null,
                message: response?.data?.message ?? 'Profile updated successfully',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Logout user (calls API and clears storage)
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await this.apiCall('/users/logout', {
                method: 'POST',
                data: { refreshToken },
            });
        } catch (e) {
            // ignore API error on logout
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    // Get current user info
    getCurrentUser() {
        const userInfo = localStorage.getItem('userInfo');
        const parsedUser = userInfo ? JSON.parse(userInfo) : null;
        console.log('getCurrentUser() - Retrieved user:', parsedUser);
        return parsedUser;
    }

    // Get auth token
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // Get roles
    async getRoles() {
        try {
            const response = await this.apiCall('/users/roles', { method: 'GET' });
            return response;
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Get permissions
    async getPermissions() {
        try {
            const response = await this.apiCall('/users/permissions', { method: 'GET' });
            return response;
        } catch (error) {
            return handleApiError(error);
        }
    }


    // Get user by ID
    async getUser(userId) {
        try {
            const response = await this.apiCall(`/users/${userId}`, {
                method: 'GET'
            });

            return response;
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Get business profile
    async getBusinessProfile(userId) {
        try {
            console.log('[authService] API Call: POST /users/business-profile', { userId });

            const response = await this.apiCall(`/users/business-profile`, {
                method: 'POST',
                data: { userId }
            });

            console.log('[authService] API Response:', response);

            // Handle both response formats: { success, data } or { isSuccess, data }
            const isSuccess = response?.success || response?.isSuccess;
            const responseData = response?.data;

            console.log('[authService] Parsed response:', { isSuccess, responseData });

            if (isSuccess && responseData) {
                // Update local user info with business profile
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    // businessProfile might be a JSON string, parse it if needed
                    let businessProfile = responseData.businessProfile || responseData;
                    if (typeof businessProfile === 'string') {
                        try {
                            businessProfile = JSON.parse(businessProfile);
                        } catch (e) {
                            console.error('[authService] Failed to parse businessProfile JSON:', e);
                            businessProfile = null;
                        }
                    }
                    const updatedUser = {
                        ...currentUser,
                        businessProfile
                    };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                }
            }

            return {
                success: !!isSuccess,
                data: responseData || null,
                error: response?.error || null,
                message: response?.message || 'Business profile retrieved successfully',
            };
        } catch (error) {
            console.error('[authService] Error getting business profile:', error);
            return handleApiError(error);
        }
    }

    // Update business profile
    async updateBusinessProfile(businessProfile) {
        try {
            console.log('API Call: POST /users/business-profile/update', { businessProfile });

            const response = await this.apiCall('/users/business-profile/update', {
                method: 'POST',
                data: { businessProfile }
            });

            console.log('API Response:', response);

            // Handle both response formats: { success, data } or { isSuccess, data }
            const isSuccess = response?.success || response?.isSuccess;
            const responseData = response?.data;

            if (isSuccess && responseData) {
                // Update local user info
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    // businessProfile is already an object from the API (not a JSON string)
                    const updatedBusinessProfile = responseData.businessProfile || responseData;
                    const updatedUser = {
                        ...currentUser,
                        businessProfile: updatedBusinessProfile
                    };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                }
            }

            return {
                success: !!isSuccess,
                data: responseData ?? null,
                error: response?.error ?? null,
                message: response?.message ?? 'Business profile updated successfully',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }
}

// Export singleton instance
export default new AuthService();
