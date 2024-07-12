import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SamplePage from './web_pages/SamplePage';
import LoginPage from './web_pages/LoginPage';
import RegisterPage from './web_pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SamplePage />} />
        <Route exact path="/sample" element={<SamplePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
