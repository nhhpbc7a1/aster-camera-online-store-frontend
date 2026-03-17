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

    // Login user (Admin only)
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            if (response.data?.data) {
                const { accessToken, user } = response.data.data;

                // Store token
                if (accessToken) {
                    localStorage.setItem('authToken', accessToken);
                }

                // Store user info
                if (user) {
                    const jwtPayload = this.decodeJwt(accessToken);
                    
                    // Ensure roles array exists
                    let roles = [];
                    if (user.roles && Array.isArray(user.roles)) {
                        roles = user.roles;
                    } else if (user.role && typeof user.role === 'string') {
                        // Convert single role string to array
                        roles = [user.role];
                    }
                    
                    const userInfo = {
                        userId: user.id || jwtPayload?.sub,
                        email: user.email,
                        fullName: user.fullName,
                        role: user.role,
                        roles: roles, // Always provide roles array
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }

                return {
                    success: true,
                    data: response.data.data,
                };
            }

            return {
                success: false,
                message: 'Invalid response format',
            };
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Logout user
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('authToken');
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
        if (!userInfo) {
            return null;
        }
        
        const parsedUser = JSON.parse(userInfo);
        
        // Ensure roles array exists for backward compatibility
        if (!parsedUser.roles || !Array.isArray(parsedUser.roles)) {
            if (parsedUser.role && typeof parsedUser.role === 'string') {
                parsedUser.roles = [parsedUser.role];
            } else {
                parsedUser.roles = [];
            }
        }
        
        return parsedUser;
    }

    // Get auth token
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }
}

// Export singleton instance
export default new AuthService();
