import React from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import SamplePage from './web_pages/crud_pages/SamplePage';
import LoginPage from './web_pages/LoginPage';
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

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
          <NavLink to="/sample" style={{ marginRight: '10px' }} activeClassName="active">
            Sample
          </NavLink>
          <NavLink to="/login" style={{ marginRight: '10px' }} activeClassName="active">
            Login
          </NavLink>
          <NavLink to="/register" style={{ marginRight: '10px' }} activeClassName="active">
            Register
          </NavLink>
          <NavLink to="/user_type" style={{ marginRight: '10px' }} activeClassName="active">
            User Type
          </NavLink>
          <NavLink to="/users" style={{ marginRight: '10px' }} activeClassName="active">
            Users
          </NavLink>
          <NavLink to="/addresses" style={{ marginRight: '10px' }} activeClassName="active">
            Addresses
          </NavLink>
          <NavLink to="/shops" style={{ marginRight: '10px' }} activeClassName="active">
            Shops
          </NavLink>
          <NavLink to="/crop_category" style={{ marginRight: '10px' }} activeClassName="active">
            Crop Category
          </NavLink>
          <NavLink to="/metric_system" style={{ marginRight: '10px' }} activeClassName="active">
            Metric System
          </NavLink>
          <NavLink to="/crops" style={{ marginRight: '10px' }} activeClassName="active">
            Crops
          </NavLink>
          <NavLink to="/order_status" style={{ marginRight: '10px' }} activeClassName="active">
            Order Status
          </NavLink>
          <NavLink to="/orders" style={{ marginRight: '10px' }} activeClassName="active">
            Orders
          </NavLink>
          <NavLink to="/order_products" style={{ marginRight: '10px' }} activeClassName="active">
            Order Products
          </NavLink>
          <NavLink to="/carts" style={{ marginRight: '10px' }} activeClassName="active">
            Carts
          </NavLink>
          <NavLink to="/cart_products" style={{ marginRight: '10px' }} activeClassName="active">
            Cart Products
          </NavLink>
          <NavLink to="/reviews" style={{ marginRight: '10px' }} activeClassName="active">
            Reviews
          </NavLink>
          <NavLink to="/order_tracking" style={{ marginRight: '10px' }} activeClassName="active">
            Order Tracking
          </NavLink>
          <NavLink to="/payments" style={{ marginRight: '10px' }} activeClassName="active">
            Payments
          </NavLink>
          <NavLink to="/notifications" style={{ marginRight: '10px' }} activeClassName="active">
            Notifications
          </NavLink>
        </nav>

        <Routes>
          <Route exact path="/" element={<SamplePage />} />
          <Route exact path="/sample" element={<SamplePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/user_type" element={<UserTypePage />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
