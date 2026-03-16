import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignUpForm from '@/public/features/auth/components/SignUpForm';
import ForgotPassword from '@/public/features/auth/components/ForgotPassword';
import LoginForm from '@/public/features/auth/components/LoginForm';
import { useAuth } from '@/core/auth/AuthContext';
import iconStore from '@/public/assets/icon/icon_store.png';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // 🎯 FIX: Redirect nếu đã đăng nhập
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token && isAuthenticated) {
            // Lấy user info từ localStorage hoặc context
            let userData = user;
            if (!userData) {
                try {
                    userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
                } catch (e) {
                    userData = {};
                }
            }

            const userRoles = userData?.roles || [];
            
            // Redirect dựa trên role
            if (userRoles.includes('ADMIN')) {
                navigate('/admin/dashboard', { replace: true });
            } else if (userRoles.includes('SELLER')) {
                navigate('/seller/dashboard', { replace: true });
            } else if (userRoles.includes('SUPPLIER')) {
                navigate('/supplier/dashboard', { replace: true });
            } else {
                navigate('/customer/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const getForm = () => {
        // Handle /auth routes
        if (location.pathname === '/auth/signup') {
            return <SignUpForm />;
        }
        if (location.pathname === '/auth/forgot-password') {
            return <ForgotPassword />;
        }
        // Handle /customer routes (for backward compatibility)
        if (location.pathname === '/customer/signup') {
            return <SignUpForm />;
        }
        if (location.pathname === '/customer/forgot-password') {
            return <ForgotPassword />;
        }
        // Default to LoginForm for all other paths, e.g., /auth/login
        return <LoginForm />;
    };

    return (
        <div className="flex gap-5 items-center justify-center h-screen bg-gradient-to-r from-[#1c2c5b] to-[#283e83]">
            {/* Left side: consistent branding */}
            <div className='w-1/3 flex flex-col text-center items-center'>
                <img
                    src={iconStore}
                    alt="HaKora Logo"
                    className="w-60"
                />
                <h1 className="text-white text-4xl font-semibold">HaKora</h1>
                <p className="text-white text-lg font-semibold mt-2 text-center">
                    Your Unique Finds, Your Brilliant Style
                </p>
            </div>

            {/* Right side: dynamic form based on URL */}
            {getForm()}
        </div>
    );
};

export default AuthPage;