import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/apps/admin/layout/AdminLayout.jsx";
import ProtectedRoute from "@/public/guards/ProtectedRoute";
import DashboardPage from "@/apps/admin/features/dashboard/pages/DashboardPage";
import AdminProductPage from "@/apps/admin/features/product/pages/AdminProductPage";
import ProductFormPage from "@/apps/admin/features/product/pages/ProductFormPage";
import AdminCategoryPage from "@/apps/admin/features/category/pages/AdminCategoryPage";
import CategoryFormPage from "@/apps/admin/features/category/pages/CategoryFormPage";
import AdminOrderPage from "@/apps/admin/features/order/pages/AdminOrderPage";
import AdminStorePage from "@/apps/admin/features/store/pages/AdminStorePage";
import StoreFormPage from "@/apps/admin/features/store/pages/StoreFormPage";
import AdminReviewPage from "@/apps/admin/features/review/pages/AdminReviewPage";

import '@/apps/admin/layout/AdminComponent.css';

const AdminRoutes = () => {
  return (
    <div className="AdminComponent">
      <ProtectedRoute requiredRoles={["ADMIN", "admin"]}>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="products/add" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="categories/add" element={<CategoryFormPage />} />
            <Route path="categories/edit/:id" element={<CategoryFormPage />} />
            <Route path="orders" element={<AdminOrderPage />} />
            <Route path="stores" element={<AdminStorePage />} />
            <Route path="stores/add" element={<StoreFormPage />} />
            <Route path="stores/edit/:id" element={<StoreFormPage />} />
            <Route path="reviews" element={<AdminReviewPage />} />
          </Route>
        </Routes>
      </ProtectedRoute>
    </div>
  );
};
export default AdminRoutes;
