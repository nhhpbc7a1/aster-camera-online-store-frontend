import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../components";
import { useAuth } from "@/core/auth/AuthContext";

const LoginPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogin = async (formData) => {
        try {
            // Use AuthContext login to update state properly
            const result = await auth.login(formData.username, formData.password);
            
            if (result.success) {
                // Use window.location to force full page reload
                // This ensures AuthContext is properly initialized with new auth state
                const user = result.user;
                if (user?.role === 'admin' || user?.roles?.includes('admin')) {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/';
                }
            } else {
                throw new Error(result.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    return (
        <LoginModal
            isOpen={isModalOpen}
            onClose={handleClose}
            onLogin={handleLogin}
        />
    );
};

export default LoginPage;
