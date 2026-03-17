import { useState, useEffect } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Load saved credentials when modal opens
    useEffect(() => {
        if (isOpen) {
            const savedUsername = localStorage.getItem('rememberedUsername');
            const savedPassword = localStorage.getItem('rememberedPassword');
            const rememberMe = localStorage.getItem('rememberMe') === 'true';

            if (rememberMe && savedUsername && savedPassword) {
                setFormData({
                    username: savedUsername,
                    password: savedPassword,
                    rememberMe: true
                });
            }
        }
    }, [isOpen]);

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
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Handle remember me functionality
            if (formData.rememberMe) {
                // Save credentials to localStorage
                localStorage.setItem('rememberedUsername', formData.username);
                localStorage.setItem('rememberedPassword', formData.password);
                localStorage.setItem('rememberMe', 'true');
            } else {
                // Clear saved credentials
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
                localStorage.removeItem('rememberMe');
            }

            // Reset form on success (but keep remembered data if checkbox is checked)
            if (!formData.rememberMe) {
                setFormData({
                    username: "",
                    password: "",
                    rememberMe: false
                });
            }
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
                    <div className="mb-6 flex items-center justify-between">
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
                        
                        {/* Clear saved password button */}
                        {localStorage.getItem('rememberMe') === 'true' && (
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.removeItem('rememberedUsername');
                                    localStorage.removeItem('rememberedPassword');
                                    localStorage.removeItem('rememberMe');
                                    setFormData({
                                        username: "",
                                        password: "",
                                        rememberMe: false
                                    });
                                }}
                                className="text-xs text-gray-500 hover:text-red-600"
                                disabled={isLoading}
                            >
                                Xóa đã lưu
                            </button>
                        )}
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
                            }}
                            className="text-black font-semibold hover:underline text-sm"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    {/* Demo credentials note */}
                    <div className="mb-4 p-3 bg-[#E5F5E5] border border-[#447744] rounded-lg mt-3">
                        <p className="text-xs text-[#447744] font-semibold mb-1">Demo Credentials:</p>
                        <p className="text-xs text-[#447744]">
                            <span className="font-semibold">Email:</span>admin@camerastore.com<br/>
                            <span className="font-semibold">Mật khẩu:</span> admin123
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
