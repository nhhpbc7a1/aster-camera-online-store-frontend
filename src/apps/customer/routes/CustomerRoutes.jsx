// Customer Routes Configuration
import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/apps/customer/layout/CustomerLayout";
import HomePage from "@/apps/customer/features/home/pages/HomePage";
import ProductListingPage from "@/apps/customer/features/product/pages/ProductListingPage";
import ProductDetailPage from "@/apps/customer/features/product/pages/ProductDetailPage";
import CartPage from "@/apps/customer/features/cart/pages/CartPage";
import StorePage from "@/apps/customer/features/store/pages/StorePage";
import LoginPage from "@/public/auth/pages/LoginPage";
import { CartProvider } from "@/domains/cart/context/CartContext";

const CustomerRoutes = () => {
  return (
    <CartProvider>
      <Routes>
        {/* Login page without layout */}
        <Route path="login" element={<LoginPage />} />
        
        {/* Routes with CustomerLayout */}
        <Route path="" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Products Routes */}
          <Route path="products" element={<ProductListingPage />} />
          <Route path="products/category/:categorySlug" element={<ProductListingPage />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="category/:categorySlug" element={<ProductListingPage />} />
          <Route path="search" element={<ProductListingPage />} />
          
          {/* Product Detail */}
          <Route path="product/:productId" element={<ProductDetailPage />} />
          
          {/* Other Pages */}
          <Route path="cart" element={<CartPage />} />
          <Route path="store" element={<StorePage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default CustomerRoutes;
