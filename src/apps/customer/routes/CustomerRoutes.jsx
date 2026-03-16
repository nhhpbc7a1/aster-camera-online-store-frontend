// Customer Routes Configuration
import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/apps/customer/layout/CustomerLayout";
import HomePage from "@/apps/customer/features/home/pages/HomePage";
import ProductListingPage from "@/apps/customer/features/product/pages/ProductListingPage";
import ProductDetailPage from "@/apps/customer/features/product/pages/ProductDetailPage";
import CartPage from "@/apps/customer/features/cart/pages/CartPage";
import StorePage from "@/apps/customer/features/store/pages/StorePage";
import { CartProvider } from "@/domains/cart/context/CartContext";

const CustomerRoutes = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path="" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="category/:categorySlug"
            element={<ProductListingPage />}
          />
          <Route path="search" element={<ProductListingPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="store" element={<StorePage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default CustomerRoutes;
