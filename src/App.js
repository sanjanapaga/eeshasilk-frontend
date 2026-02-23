import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Imports removed
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import OrderManagement from './pages/OrderManagement';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/shop" element={<UserLayout><Shop /></UserLayout>} />
      <Route path="/about" element={<UserLayout><About /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <UserLayout><Wishlist /></UserLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/product/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <UserLayout><Checkout /></UserLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <UserLayout><MyOrders /></UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <UserLayout><OrderDetail /></UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin/Agent Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAgent={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAgent={true}>
            <OrderManagement />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
    </Routes>
  );
}

export default App;
