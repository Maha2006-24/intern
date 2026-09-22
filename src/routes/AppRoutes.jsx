import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/admin/Dashboard";
import Medicines from "../pages/admin/Medicines";
import AddMedicine from "../pages/admin/AddMedicine";
import EditMedicine from "../pages/admin/EditMedicine";
import Suppliers from "../pages/admin/Suppliers";
import AddSupplier from "../pages/admin/AddSupplier";
import EditSupplier from "../pages/admin/EditSupplier";
import Customers from "../pages/admin/Customers";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";

import CustomerHome from "../pages/customer/Home";
import CustomerMedicines from "../pages/customer/Medicines";
import MedicineDetails from "../pages/customer/MedicineDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import FakePayment from "../pages/customer/FakePayment";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import MyOrders from "../pages/customer/MyOrders";
import Profile from "../pages/customer/Profile";

import { getAuthSession } from "../utils/auth";

function ProtectedRoute({ children, allowedRole }) {
  const session = getAuthSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && session.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="medicines/add" element={<AddMedicine />} />
        <Route path="medicines/edit" element={<EditMedicine />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="suppliers/add" element={<AddSupplier />} />
        <Route path="suppliers/edit" element={<EditSupplier />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/home" replace />} />

        <Route path="home" element={<CustomerHome />} />
        <Route path="medicines" element={<CustomerMedicines />} />
        <Route path="medicine" element={<MedicineDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<FakePayment />} />

        {/* NEW ROUTE */}
        <Route
          path="payment-success"
          element={<PaymentSuccess />}
        />

        <Route path="orders" element={<MyOrders />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}