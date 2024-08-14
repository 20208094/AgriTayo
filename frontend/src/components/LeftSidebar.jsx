import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function LeftSidebar() {
    return (
        <div className="sidebar">
            <link rel="icon" type="image/svg+xml" href="/AgriTayo_Logo.svg" className='sidebar-icon' />

            <div className="flex items-center mb-5">
                <img src="/AgriTayo_Logo.svg" alt="AgriTayoLogo" className="ml-5 h-11" />
                <h2 className="sidebar-title">AgriTayo</h2>
            </div>

            {/* ADMIN NAVIGATION */}
            {userType === 1 && <AdminSidebar />}
            {/* SELLER NAVIGATION */}
            {userType === 2 && <SellerSidebar />}
            {/* BUYER NAVIGATION */}
            {userType === 3 && <BuyerSidebar />}

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
    );
}

export default LeftSidebar;
