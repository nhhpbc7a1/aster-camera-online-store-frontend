import { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.username.trim()) {
            setError("Vui lòng nhập tên tài khoản hoặc email");
            return;
        }

        if (!formData.password) {
            setError("Vui lòng nhập mật khẩu");
            return;
        }

        setIsLoading(true);

        try {
            // Call the onLogin callback if provided
            if (onLogin) {
                await onLogin(formData);
            } else {
                // Default behavior - just log for now
                console.log("Login attempt:", formData);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Reset form on success
            setFormData({
                username: "",
                password: "",
                rememberMe: false
            });
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-red-600">
                        ĐĂNG NHẬP
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                        aria-label="Đóng"
                    >
                        <i className="fa-solid fa-xmark text-gray-600 text-xl"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Username/Email field */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Tên tài khoản hoặc địa chỉ email <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Nhập tên tài khoản hoặc email"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password field */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Nhập mật khẩu"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Remember me checkbox */}
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 accent-black border-gray-300 rounded focus:ring-black cursor-pointer"
                                disabled={isLoading}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Ghi nhớ mật khẩu
                            </span>
                        </label>
                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn btn-primary"
                    >
                        {isLoading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                    </button>

                    {/* Forgot password link */}
                    <div className="mt-4 text-center">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                // Handle forgot password
                                console.log("Forgot password clicked");
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
