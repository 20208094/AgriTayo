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

// for admin
import AdminDashboardPage from './screens/Users/AdminPages/AdminDashboard/AdminDashboard';
import AnalyticsPage from './screens/Users/AdminPages/AdminDashboard/AnalyticsPage';
import ReportsPage from './screens/Users/AdminPages/AdminDashboard/ReportsPage';
import MarketAnalyticsPage from './screens/Users/AdminPages/AdminDashboard/MarketAnalyticsPage';

import SellerDashboardPage from './screens/Users/SellerPages/SellerDashboard';
import BuyerDashboardPage from './screens/Users/BuyerPages/BuyerDashboard';

// for market
import CropCategoryPage from './screens/Market/CropCategoryPage';
import CropSubCategoryPage from './screens/Market/CropSubCategoryPage';
import ProductListPage from './screens/Market/ProductListPage';
import ProductDetaulsPage from './screens/Market/ProductDetailsPage';

import SampleSearch from './screens/Users/AdminPages/CrudPages/SearchSample';
import DownloadAppPage from './screens/DownloadApp/DownloadAppPage';
// navigation bars
import LeftSidebar from './components/LeftSidebar';
import TopNavbar from './components/TopNavbar';
import SubSidebar from './components/SubSidebar';
// my account routes
import Profile from './screens/Users/BuyerPages/Profile/Profile';
import Addresses from './screens/Users/BuyerPages/Profile/Adresses';
import ChangePassword from './screens/AuthPages/ChangePasswordPage';
import ConfirmChangePassword from './screens/AuthPages/ConfirmChangePasswordPage';
import ChangeEmail from './screens/Users/BuyerPages/Profile/ChangeEmail';
import DeleteAccount from './screens/Users/BuyerPages/Profile/DeleteAccount';
// orders routes
import All from './screens/Users/BuyerPages/Orders/All';
import Cancelled from './screens/Users/BuyerPages/Orders/Cancelled';
import Completed from './screens/Users/BuyerPages/Orders/Completed';
import ReturnOrRefund from './screens/Users/BuyerPages/Orders/ReturnOrRefund';
import ToPay from './screens/Users/BuyerPages/Orders/ToPay';
import ToRecieve from './screens/Users/BuyerPages/Orders/ToRecieve';
import ToShip from './screens/Users/BuyerPages/Orders/ToShip';
import OrdersTopNavigationbar from './screens/Users/BuyerPages/Orders/OrdersComponent/OrdersTopNavigationbar';

import ChatPage from './screens/Chat';
import ChatListPage from './screens/ChatListPage';

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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/logout';

  //array for OrderTopNavigationbar
  const pathsWithOrderTopNavigationbar = [
    '/all',
    '/cancelled',
    '/completed',
    '/returnOrRefund',
    '/toPay',
    '/toRecieve',
    '/toShip',
  ]

  return (
    <div className="flex">
      {!isAuthPage && <TopNavbar userType={userType} />}
      {!isAuthPage && <LeftSidebar userType={userType} />}
      {!isAuthPage && <SubSidebar userType={userType} />}

      {/* this use the array of the pathsWithOrderTopNavigationbar */}
      {pathsWithOrderTopNavigationbar.includes(location.pathname) && <OrdersTopNavigationbar/>}

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          {/* FREE ROUTES used for development */}
          <Route exact path="/sample" element={<SampleSearch />} />
          {/* for market */}
          <Route exact path="/crop-category" element={<CropCategoryPage />} />
          <Route  exact path="/crop-subcategory/:cropCategoryId" element={<CropSubCategoryPage/>}/>
          <Route exact path='/product-list/:cropSubCategoryId' element={<ProductListPage/>}/>
          <Route exact path = '/product-details/:productListId' element={<ProductDetaulsPage/>}/>

          <Route exact path="/downloadapp" element={<DownloadAppPage />} />
          <Route exact path="/users" element={<UsersPage />} />
          {/* for accounts */}
          <Route exact path='/profile' element={<Profile />} />
            <Route path="crop_category" element={<CropCategoryPageCRUD />} />
            <Route path="users" element={<UsersPage />} />
            <Route exact path='addresses' element={<Addresses/>}/>
          <Route exact path='addresses' element={<Addresses />} />
          <Route exact path='/change_pasword' element={<ChangePassword />} />
          <Route exact path='/confirm_change_password' element={<ConfirmChangePassword />} />
          <Route exact path='/changeEmail' element={<ChangeEmail />} />
          <Route exact path='/deleteAccount' element={<DeleteAccount />} />
          {/* for orders */}
          <Route exact path='/all' element={<All />} />
          <Route exact path='/cancelled' element={<Cancelled />} />
          <Route exact path='/completed' element={<Completed />} />
          <Route exact path='/returnOrRefund' element={<ReturnOrRefund />} />
          <Route exact path='/toPay' element={<ToPay />} />
          <Route exact path='/toRecieve' element={<ToRecieve />} />
          <Route exact path='/toShip' element={<ToShip />} />
          {/* for admin */}
          <Route exact path="/admin-dash" element={<AdminDashboardPage />} />
          <Route exact path='/analytics' element={<AnalyticsPage />} />
          <Route exact path='/marketAnalytics' element={<MarketAnalyticsPage />} />
          <Route exact path="/reports" element={<ReportsPage />} />
          <Route exact path="/chat" element={<ChatPage />} />
          <Route path="/chatlist" element={<ChatListPage />} />
          <Route path="/chat/:receiverId" element={<ChatPage />} />


          {/* ChangePassword ROUTES */}
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
            <Route path='marketAnalytics' element={<MarketAnalyticsPage />} />
            <Route path='analytics' element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsPage />} />
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
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<Addresses />} />
            <Route path="change_password" element={<ChangePassword />} />
            <Route path="delete_account" element={<DeleteAccount />} />
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
