import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import AdminSidebar from './Sidebar/AdminSidebar';
import SellerSidebar from './Sidebar/SellerSidebar';
import BuyerSidebar from './Sidebar/BuyerSidebar';

function LeftSidebar({ userType }) {
    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="flex items-center mb-5">
                <img src="/AgriTayo_Logo.svg" alt="AgriTayo Logo" className="ml-5 h-11" />
                <h2 className="sidebar-title">AgriTayo</h2>
            </div>

            {/* Conditional Sidebar Content */}
            {userType === 1 && <AdminSidebar />}
            {userType === 2 && <SellerSidebar />}
            {userType === 3 && <BuyerSidebar />}

            {/* Login/Logout Link */}
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
    );
}

export default LeftSidebar;
