import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { FaMoneyBillWave, FaClipboardList, FaTruck, FaBell } from 'react-icons/fa';
import { IoLogIn, IoLogOut } from "react-icons/io5";
import SamplePage from './crud_pages/SamplePage';
import LoginPage from './auth_pages/LoginPage';
import LogoutButton from './auth_pages/LogoutPage';
import RegisterPage from './auth_pages/RegisterPage';
import UserTypePage from './crud_pages/UserTypePage';
import UsersPage from './crud_pages/UsersPage';
import AddressesPage from './crud_pages/AdressesPage';
import ShopPage from './crud_pages/ShopPage';
import CropCategoryPage from './crud_pages/CropCategoryPage';
import MetricSystemPage from './crud_pages/MetricSystemPage';
import CropsPage from './crud_pages/CropsPage';
import OrderStatusPage from './crud_pages/OrderStatusPage';
import OrdersPage from './crud_pages/OrdersPage';
import OrderProductsPage from './crud_pages/OrderProductsPage';
import CartPage from './crud_pages/CartPage';
import CartProductsPage from './crud_pages/CartProductsPage';
import ReviewsPage from './crud_pages/ReviewsPage';
import OrderTrackingPage from './crud_pages/OrderTrackingPage';
import PaymentsPage from './crud_pages/PaymentsPage';
import NotificationsPage from './crud_pages/NotificationsPage';
import AdminDashboardPage from './adminpages/admin_dashboard';
import NavUserType1 from './navigation/NavUserType1';
import NavUserType2 from './navigation/NavUserType2';
import NavUserType3 from './navigation/NavUserType3';

function App() {
  const [userType, setUserType] = useState(null);
  const [showOrdersLinks, setShowOrdersLinks] = useState(false);

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await fetch('/api/session'); // Adjust URL based on your server setup
        if (response.ok) {
          const data = await response.json();
          setUserType(data.user_type_id);
        } else {
          console.error('Failed to fetch user session:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching user session:', err.message);
      }
    }

    fetchUserSession();
  }, []);

  return (
    <Router>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="sidebar">
          <link rel="icon" type="image/svg+xml" href="/AgriTayo_Logo.svg" className='sidebar-icon' />
          <div className="flex items-center mb-5">
  <img src="/AgriTayo_Logo.svg" alt="AgriTayoLogo" className="ml-5 h-11" />
  <h2 className="sidebar-title">AgriTayo</h2>
</div>
          {/* ADMIN NAVIGATION */}
          {userType === 1 && <NavUserType1 />}
          {/* SELLER NAVIGATION */}
          {userType === 2 && <NavUserType2 />}
          {/* BUYER NAVIGATION */}
          {userType === 3 && <NavUserType3 />}

          {/* LOGIN AND LOGOUT */}
          {userType ? (
            <NavLink to="/logout" className="sidebar-item">
              <IoLogOut className="sidebar-icon" />
              <span className="sidebar-text">Logout</span>
            </NavLink>
          ) : (
            <NavLink to="/login" className="sidebar-item">
              <IoLogIn className="sidebar-icon" />
              <span className="sidebar-text">Login</span>
            </NavLink>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route exact path="/" element={<SamplePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<RegisterPage />} />
            <Route exact path="/logout" element={<LogoutButton />} />
            {/* ADMIN ROUTES */}
            {userType === 1 && (
              <>
                <Route exact path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route exact path="/admin/user_type" element={<UserTypePage />} />
                <Route exact path="/admin/addresses" element={<AddressesPage />} />
                <Route exact path="/admin/users" element={<UsersPage />} />
                <Route exact path="/admin/shops" element={<ShopPage />} />
                <Route exact path="/admin/crop_category" element={<CropCategoryPage />} />
                <Route exact path="/admin/metric_system" element={<MetricSystemPage />} />
                <Route exact path="/admin/crops" element={<CropsPage />} />
                <Route exact path="/admin/order_status" element={<OrderStatusPage />} />
                <Route exact path="/admin/orders" element={<OrdersPage />} />
                <Route exact path="/admin/order_products" element={<OrderProductsPage />} />
                <Route exact path="/admin/carts" element={<CartPage />} />
                <Route exact path="/admin/cart_products" element={<CartProductsPage />} />
                <Route exact path="/admin/reviews" element={<ReviewsPage />} />
                <Route exact path="/admin/order_tracking" element={<OrderTrackingPage />} />
                <Route exact path="/admin/payments" element={<PaymentsPage />} />
                <Route exact path="/admin/notifications" element={<NotificationsPage />} />
              </>
            )}
            {/* SELLER ROUTES */}
            {userType === 2 && (
              <Route exact path="/seller/sample" element={<SamplePage />} />
            )}
            {/* BUYER ROUTES */}
            {userType === 3 && (
              <Route exact path="/buyer/sample" element={<SamplePage />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
