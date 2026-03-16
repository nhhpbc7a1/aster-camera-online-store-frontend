import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/domains/cart/context/CartContext";
import { LoginModal } from "@/public/auth";
import authService from "@/core/auth/authService";
import logo from "@/assets/logo.jpg";

function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const result = await authService.login(formData.username, formData.password);

      if (result.success) {
        // Update user state
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Close modal
        setIsLoginModalOpen(false);

        // Use window.location to force full page reload
        // This ensures AuthContext is properly initialized
        if (authService.isAdmin()) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.reload();
        }
      } else {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setShowUserMenu(false);
    // Refresh page
    window.location.reload();
  };

  return (
    <div className="bg-white shadow-sm py-3">
      <div className="container mx-auto flex items-center gap-6 px-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-black">
          <img src={logo} alt="Logo" className="w-20 h-20 " />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-full px-4 py-2 outline-none focus:border-black"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-black flex items-center justify-center"
            >
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </button>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/store" className="btn btn-outline">
            HỆ THỐNG CỬA HÀNG
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn btn-primary flex items-center gap-2"
              >
                <i className="fa-solid fa-user"></i>
                {user.fullName || user.email}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-gauge mr-2"></i>
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="btn btn-primary"
            >
              ĐĂNG NHẬP
            </button>
          )}

          <Link
            to="/cart"
            className="relative btn btn-primary flex items-center gap-2"
          >
            <i className="fa-solid fa-cart-shopping"></i> GIỎ HÀNG
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Header;
