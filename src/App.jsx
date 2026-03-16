import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import CustomerRoutes from "@/apps/customer/routes/CustomerRoutes";
import AdminRoutes from "@/apps/admin/routes/AdminRoutes";
import ProtectedRoute from "@/public/guards/ProtectedRoute";
import { useAuth } from "@/core/auth/AuthContext";
import { CartProvider } from "@/domains/cart/context/CartContext";

function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            path="/admin/*"
            element={
              // <ProtectedRoute requiredRoles={["ADMIN"]}>
              <AdminRoutes />
              // </ProtectedRoute>
            }
          />
          <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
