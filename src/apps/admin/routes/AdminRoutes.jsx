import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/apps/admin/layout/AdminLayout.jsx";
import ProtectedRoute from "@/public/guards/ProtectedRoute";
import AdminProductPage from "@/apps/admin/features/product/pages/AdminProductPage";
import AdminCategoryPage from "@/apps/admin/features/category/pages/AdminCategoryPage";
import AdminOrderPage from "@/apps/admin/features/order/pages/AdminOrderPage";

const AdminRoutes = () => {
  return (
    <div className="AdminComponent">
      <ProtectedRoute requiredRoles={["ADMIN"]}>
        <Routes>
          <Route path="" element={<Layout />}>
            <Route index element={<AdminProductPage />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="orders" element={<AdminOrderPage />} />
          </Route>
        </Routes>
      </ProtectedRoute>
    </div>
  );
};
export default AdminRoutes;
