import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { IoLogIn, IoLogOut } from "react-icons/io5";
import SamplePage from './screens/Users/AdminPages/CrudPages/SamplePage';
import LoginPage from './AuthPages/LoginPage';
import LogoutButton from './AuthPages/LogoutPage';
import RegisterPage from './AuthPages/RegisterPage';
import UserTypePage from './screens/Users/AdminPages/CrudPages/UserTypePage';
import UsersPage from './screens/Users/AdminPages/CrudPages/UsersPage';
import AddressesPage from './screens/Users/AdminPages/CrudPages/AdressesPage';
import ShopPage from './screens/Users/AdminPages/CrudPages/ShopPage';
import CropCategoryPage from './screens/Users/AdminPages/CrudPages/CropCategoryPage';
import MetricSystemPage from './screens/Users/AdminPages/CrudPages/MetricSystemPage';
import CropsPage from './screens/Users/AdminPages/CrudPages/CropsPage';
import OrderStatusPage from './screens/Users/AdminPages/CrudPages/OrderStatusPage';
import OrdersPage from './screens/Users/AdminPages/CrudPages/OrdersPage';
import OrderProductsPage from './screens/Users/AdminPages/CrudPages/OrderProductsPage';
import CartPage from './screens/Users/AdminPages/CrudPages/CartPage';
import CartProductsPage from './screens/Users/AdminPages/CrudPages/CartProductsPage';
import ReviewsPage from './screens/Users/AdminPages/CrudPages/ReviewsPage';
import OrderTrackingPage from './screens/Users/AdminPages/CrudPages/OrderTrackingPage';
import PaymentsPage from './screens/Users/AdminPages/CrudPages/PaymentsPage';
import NotificationsPage from './screens/Users/AdminPages/CrudPages/NotificationsPage';
import AdminDashboardPage from './screens/Users/AdminPages/AdminDashboard';
import AdminSidebar from './components/Sidebar/AdminSidebar';
import SellerSidebar from './components/Sidebar/SellerSidebar';
import BuyerSidebar from './components/Sidebar/BuyerSidebar';
import LeftSidebar from './components/LeftSidebar';

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
        <LeftSidebar />

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
