import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import SamplePage from './screens/Users/AdminPages/CrudPages/SamplePage';
import LoginPage from './screens/AuthPages/LoginPage';
import LogoutButton from './screens/AuthPages/LogoutPage';
import RegisterPage from './screens/AuthPages/RegisterPage';
import UserTypePage from './screens/Users/AdminPages/CrudPages/UserTypePage';
import UsersPage from './screens/Users/AdminPages/CrudPages/UsersPage';
import AddressesPage from './screens/Users/AdminPages/CrudPages/AdressesPage';
import ShopPage from './screens/Users/AdminPages/CrudPages/ShopPage';
import CropCategoryPageCRUD from './screens/Users/AdminPages/CrudPages/CropCategoryPageCRUD';
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
import LeftSidebar from './components/LeftSidebar';
import TopNavbar from './components/TopNavbar';
import AdminDashboardPage from './screens/Users/AdminPages/AdminDashboard';
import SellerDashboardPage from './screens/Users/SellerPages/SellerDashboard';
import BuyerDashboardPage from './screens/Users/BuyerPages/BuyerDashboard';
import CropCategoryPage from './screens/Market/CropCategoryPage';
import SampleSearch from './screens/Users/AdminPages/CrudPages/SearchSample';
import DownloadAppPage from './screens/DownloadApp/DownloadAppPage';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await fetch('/api/session', {
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserType(data.user_type_id);
        } else {
          console.error('Failed to fetch user session:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching user session:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout userType={userType} />
    </Router>
  );
}

function ProtectedRoute({ allowedUserType, userType, element }) {
  if (userType === null) {
    // Redirect to login if userType is null (not logged in)
    return <Navigate to="/login" />;
  }

  if (userType === allowedUserType) {
    return <Outlet />;
  }

  // Redirect users to their appropriate dashboard based on userType
  if (userType === 1) {
    return <Navigate to="/admin/dashboard" />;
  } else if (userType === 2) {
    return <Navigate to="/seller/dashboard" />;
  } else if (userType === 3) {
    return <Navigate to="/buyer/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
}

function Layout({ userType }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex">
      {!isAuthPage && <TopNavbar userType={userType} />}
      {!isAuthPage && <LeftSidebar userType={userType} />}

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          {/* FREE ROUTES used for development */}
          <Route exact path="/sample" element={<SampleSearch />} />
          <Route exact path="/crop-category" element={<CropCategoryPage />} />
          <Route exact path="/admin-dash" element={<AdminDashboardPage />} />
          <Route exact path="/downloadapp" element={<DownloadAppPage />} />
          <Route exact path="/users" element={<UsersPage />} />

            {/* AUTHENTICATION ROUTES */}
            {!userType && (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </>
            )}
            <Route path="/logout" element={<LogoutButton />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/*"
            element={<ProtectedRoute element={<AdminDashboardPage />} allowedUserType={1} userType={userType} />}
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="user_type" element={<UserTypePage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="shops" element={<ShopPage />} />
            <Route path="crop_category" element={<CropCategoryPageCRUD />} />
            <Route path="metric_system" element={<MetricSystemPage />} />
            <Route path="crops" element={<CropsPage />} />
            <Route path="order_status" element={<OrderStatusPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="order_products" element={<OrderProductsPage />} />
            <Route path="carts" element={<CartPage />} />
            <Route path="cart_products" element={<CartProductsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="order_tracking" element={<OrderTrackingPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="crop-category" element={<CropCategoryPage />} />
          </Route>
          {/* SELLER ROUTES */}
          <Route
            path="/seller/*"
            element={<ProtectedRoute element={<SellerDashboardPage />} allowedUserType={2} userType={userType} />}
          >
            <Route path="sample" element={<SamplePage />} />
            <Route path="dashboard" element={<SellerDashboardPage />} />
          </Route>
          {/* BUYER ROUTES */}
          <Route
            path="/buyer/*"
            element={<ProtectedRoute element={<BuyerDashboardPage />} allowedUserType={3} userType={userType} />}
          >
            <Route path="sample" element={<SamplePage />} />
            <Route path="dashboard" element={<BuyerDashboardPage />} />
          </Route>
          {/* Default route */}
          <Route path="*" element={<Navigate to={userType === null ? "/login" : "/admin/dashboard"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
