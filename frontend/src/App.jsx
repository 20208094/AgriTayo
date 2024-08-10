import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { FaMoneyBillWave, FaClipboardList, FaTruck, FaBell } from 'react-icons/fa';
import { IoMdLogIn } from "react-icons/io";
import SamplePage from './web_pages/crud_pages/SamplePage';
import LoginPage from './web_pages/LoginPage';
import LogoutButton from './web_pages/LogoutPage';
import RegisterPage from './web_pages/RegisterPage';
import UserTypePage from './web_pages/crud_pages/UserTypePage';
import UsersPage from './web_pages/crud_pages/UsersPage';
import AddressesPage from './web_pages/crud_pages/AdressesPage';
import ShopPage from './web_pages/crud_pages/ShopPage';
import CropCategoryPage from './web_pages/crud_pages/CropCategoryPage';
import MetricSystemPage from './web_pages/crud_pages/MetricSystemPage';
import CropsPage from './web_pages/crud_pages/CropsPage';
import OrderStatusPage from './web_pages/crud_pages/OrderStatusPage';
import OrdersPage from './web_pages/crud_pages/OrdersPage';
import OrderProductsPage from './web_pages/crud_pages/OrderProductsPage';
import CartPage from './web_pages/crud_pages/CartPage';
import CartProductsPage from './web_pages/crud_pages/CartProductsPage';
import ReviewsPage from './web_pages/crud_pages/ReviewsPage';
import OrderTrackingPage from './web_pages/crud_pages/OrderTrackingPage';
import PaymentsPage from './web_pages/crud_pages/PaymentsPage';
import NotificationsPage from './web_pages/crud_pages/NotificationsPage';
import NavUserType1 from './navigation/NavUserType1'; // Ensure this is the correct path

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
          <h2 className="sidebar-title">AgriTayo</h2>

          {userType === 1 && <NavUserType1 />}

          <div className="w-full">
            {/* Orders Menu Dropdown */}
            <button
              className="w-full flex items-center p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowOrdersLinks(!showOrdersLinks)}
            >
              <FaMoneyBillWave className="sidebar-icon" />
              <span className="sidebar-text">Orders Menu</span>
              <svg className={`ml-2 w-4 h-4 ${showOrdersLinks ? 'rotate-180' : 'rotate-0'} transition-transform`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`transition-all duration-300 ease-in-out ${showOrdersLinks ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
              <NavLink to="/orders" className="dropdown-item">
                <FaMoneyBillWave className="sidebar-icon" />
                <span className="sidebar-text">Orders</span>
              </NavLink>
              <NavLink to="/order_products" className="dropdown-item">
                <FaClipboardList className="sidebar-icon" />
                <span className="sidebar-text">Order Products</span>
              </NavLink>
              <NavLink to="/order_tracking" className="dropdown-item">
                <FaTruck className="sidebar-icon" />
                <span className="sidebar-text">Order Tracking</span>
              </NavLink>
              <NavLink to="/payments" className="dropdown-item">
                <FaMoneyBillWave className="sidebar-icon" />
                <span className="sidebar-text">Payments</span>
              </NavLink>
              <NavLink to="/notifications" className="dropdown-item">
                <FaBell className="sidebar-icon" />
                <span className="sidebar-text">Notifications</span>
              </NavLink>
            </div>
          </div>

          <NavLink to="/login" className="sidebar-item">
            <IoMdLogIn className="sidebar-icon" />
            <span className="sidebar-text">Login</span>
          </NavLink>
        </div>

        {/* Main Content */}
        <div className="main-content"> {/* Adjust margin based on sidebar width */}
          <Routes>
            <Route exact path="/" element={<SamplePage />} />
            <Route exact path="/sample" element={<SamplePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<RegisterPage />} />
            {userType === 1 && (
              <Route exact path="/user_type" element={<UserTypePage />} />
            )}
            <Route exact path="/users" element={<UsersPage />} />
            <Route exact path="/addresses" element={<AddressesPage />} />
            <Route exact path="/shops" element={<ShopPage />} />
            <Route exact path="/crop_category" element={<CropCategoryPage />} />
            <Route exact path="/metric_system" element={<MetricSystemPage />} />
            <Route exact path="/crops" element={<CropsPage />} />
            <Route exact path="/order_status" element={<OrderStatusPage />} />
            <Route exact path="/orders" element={<OrdersPage />} />
            <Route exact path="/order_products" element={<OrderProductsPage />} />
            <Route exact path="/carts" element={<CartPage />} />
            <Route exact path="/cart_products" element={<CartProductsPage />} />
            <Route exact path="/reviews" element={<ReviewsPage />} />
            <Route exact path="/order_tracking" element={<OrderTrackingPage />} />
            <Route exact path="/payments" element={<PaymentsPage />} />
            <Route exact path="/notifications" element={<NotificationsPage />} />
            <Route exact path="/logout" element={<LogoutButton />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
