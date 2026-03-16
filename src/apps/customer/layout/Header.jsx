import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/domains/cart/context/CartContext";
import logo from "@/assets/logo.jpg";

function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
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

          <button className="btn btn-primary">ĐĂNG NHẬP</button>

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
    </div>
  );
}

export default Header;
