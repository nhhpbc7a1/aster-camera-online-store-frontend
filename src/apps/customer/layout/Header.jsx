import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/domains/cart/context/CartContext";
import { LoginModal } from "@/public/auth";
import authService from "@/core/auth/authService";
import logo from "@/assets/logo.jpg";
import categoryService from "@/domains/category/services/categoryService";

function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [subcategoriesMap, setSubcategoriesMap] = useState({});

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Load categories for mobile sidebar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsMobileMenuOpen(false);
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
    <>
      <div className="bg-white shadow-sm py-3">
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="hidden max-[850px]:flex max-[850px]:items-center max-[850px]:justify-between">
            {/* Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-2xl text-black"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            {/* Logo - Centered on Mobile */}
            <Link to="/" className="text-xl font-bold text-black mx-auto">
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </Link>

            {/* Cart Icon - Mobile Only */}
            <Link
              to="/cart"
              className="relative"
            >
              <i className="fa-solid fa-cart-shopping text-2xl text-black"></i>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Layout */}
          <div className="flex items-center gap-6 max-[850px]:hidden">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-black">
              <img src={logo} alt="Logo" className="w-16 h-16" />
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
            <div className="flex items-center gap-3 text-sm">
              <Link to="/store" className="btn btn-outline ">
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

          {/* Search Bar - Mobile Only, Separate Line */}
          <form onSubmit={handleSearch} className="hidden max-[850px]:block mt-3">
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
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out hidden max-[850px]:block ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl text-black"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-60px)]">
          {/* Search Bar - Top */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-full px-4 py-2 outline-none focus:border-black text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-black flex items-center justify-center"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Category Navbar - Middle */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h3 className="font-semibold text-black mb-2 uppercase">Danh mục</h3>
              <div className="flex flex-col gap-1">
                {categories.map((category) => {
                  const isExpanded = expandedCategories.has(category.id);
                  const subcategories = subcategoriesMap[category.id] || [];

                  return (
                    <div key={category.id}>
                      <div className="flex items-center">
                        <Link
                          to={`/category/${category.slug}`}
                          className="flex-1 uppercase px-3 py-2 flex items-center justify-between hover:bg-gray-100 rounded transition text-sm font-semibold text-black"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>{category.name}</span>
                        </Link>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            const newExpanded = new Set(expandedCategories);

                            if (isExpanded) {
                              newExpanded.delete(category.id);
                            } else {
                              newExpanded.add(category.id);
                              // Load subcategories if not already loaded
                              if (!subcategoriesMap[category.id]) {
                                try {
                                  // Try to get subcategories from category object or fetch category details
                                  const categoryData = await categoryService.getCategoryById(category.id);
                                  const subs = categoryData.subcategories || [];
                                  setSubcategoriesMap(prev => ({
                                    ...prev,
                                    [category.id]: subs
                                  }));
                                } catch (err) {
                                  console.error("Error loading subcategories:", err);
                                  // If category has subcategories in the initial data, use that
                                  if (category.subcategories) {
                                    setSubcategoriesMap(prev => ({
                                      ...prev,
                                      [category.id]: category.subcategories
                                    }));
                                  }
                                }
                              }
                            }

                            setExpandedCategories(newExpanded);
                          }}
                          className="px-2 py-2 hover:bg-gray-100 rounded transition"
                        >
                          <i
                            className={`fa-solid fa-chevron-right text-xs transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''
                              }`}
                          ></i>
                        </button>
                      </div>

                      {/* Subcategories */}
                      {isExpanded && subcategories.length > 0 && (
                        <div className="ml-4 mt-1 mb-1 border-l-2 border-gray-200 pl-2">
                          {subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/products/category/${subcategory.slug}`}
                              className="text-left block px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Menu - If logged in */}
            {user && (
              <div className="p-4 border-t">
                <div className="mb-3">
                  <p className="text-sm font-semibold">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 rounded mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fa-solid fa-gauge mr-2"></i>
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 rounded"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i>
                  Đăng xuất
                </button>
              </div>
            )}

            {!user && (
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full btn btn-primary"
                >
                  ĐĂNG NHẬP
                </button>
              </div>
            )}

            {/* Store Link */}
            <div className="p-4 border-t">
              <Link
                to="/store"
                className="block btn btn-outline text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HỆ THỐNG CỬA HÀNG
              </Link>
            </div>
          </div>

          {/* Media Buttons - Bottom */}
          <div className="p-4 border-t flex gap-2 justify-center">
            <a href="https://www.facebook.com/people/ASTER-Production/61585158583823/?locale=vi_VN" target="_blank" rel="noopener noreferrer">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-600 hover:scale-110 transition cursor-pointer border border-gray-300">
                <i className="fa-brands fa-facebook-f"></i>
              </span>
            </a>
            <a href="mailto:asterproduction333@gmail.com" target="_blank" rel="noopener noreferrer">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white hover:scale-110 transition cursor-pointer">
                <i className="fa-solid fa-envelope"></i>
              </span>
            </a>
            <a href="tel:0794352262" target="_blank" rel="noopener noreferrer">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:scale-110 transition cursor-pointer">
                <i className="fa-solid fa-phone"></i>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 hidden max-[850px]:block"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export default Header;
