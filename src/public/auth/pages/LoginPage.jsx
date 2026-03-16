import { useState } from "react";
import { LoginModal } from "../components";

const LoginPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleLogin = async (formData) => {
        // TODO: Implement actual login logic here
        console.log("Login data:", formData);
        
        // Example: Call your API
        // const response = await authService.login(formData);
        // Handle response, redirect, etc.
    };

    return (
        <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLogin={handleLogin}
        />
    );
};

export default LoginPage;
