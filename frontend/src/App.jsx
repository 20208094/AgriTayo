import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SamplePage from './web_pages/crud_pages/SamplePage';
import LoginPage from './web_pages/LoginPage';
import RegisterPage from './web_pages/RegisterPage';
import UserTypePage from './web_pages/crud_pages/UserTypePage';
import UsersPage from './web_pages/crud_pages/UsersPage';
import AddressesPage from './web_pages/crud_pages/AdressesPage';
import ShopPage from './web_pages/crud_pages/ShopPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SamplePage />} />
        <Route exact path="/sample" element={<SamplePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route exact path="/user_type" element={<UserTypePage />} />
        <Route exact path="/users" element={<UsersPage />} />
        <Route exact path="/addresses" element={<AddressesPage />} />
        <Route exact path="/shops" element={<ShopPage />} />
      </Routes>
    </Router>
  );
}

export default App;
