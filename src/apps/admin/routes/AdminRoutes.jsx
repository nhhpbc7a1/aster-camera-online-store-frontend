import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/apps/admin/layout/AdminLayout.jsx";
import ProtectedRoute from "@/public/guards/ProtectedRoute";
import DashboardPage from "@/apps/admin/features/dashboard/pages/DashboardPage";
import AdminProductPage from "@/apps/admin/features/product/pages/AdminProductPage";
import ProductFormPage from "@/apps/admin/features/product/pages/ProductFormPage";
import AdminCategoryPage from "@/apps/admin/features/category/pages/AdminCategoryPage";
import AdminOrderPage from "@/apps/admin/features/order/pages/AdminOrderPage";
import AdminStorePage from "@/apps/admin/features/store/pages/AdminStorePage";
import AdminReviewPage from "@/apps/admin/features/review/pages/AdminReviewPage";

import '@/apps/admin/layout/AdminComponent.css';

const AdminRoutes = () => {
  return (
    <div className="AdminComponent">
      {/* <ProtectedRoute requiredRoles={["ADMIN"]}> */}
      <Routes>
        <Route path="" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="products/add" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />
          <Route path="categories" element={<AdminCategoryPage />} />
          <Route path="orders" element={<AdminOrderPage />} />
          <Route path="stores" element={<AdminStorePage />} />
          <Route path="reviews" element={<AdminReviewPage />} />
        </Route>
      </Routes>
      {/* </ProtectedRoute> */}
    </div>
  );
};
export default AdminRoutes;
