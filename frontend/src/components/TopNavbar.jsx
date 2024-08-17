import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoLogIn, IoLogOut, IoCart } from 'react-icons/io5'; // Ensure IoCart is imported
import AdminTopNavbar from './TopNavbar/AdminTopNavbar';
import SellerTopNavbar from './TopNavbar/SellerTopNavbar';
import BuyerTopNavbar from './TopNavbar/BuyerTopNavbar';

function TopNavbar({ userType }) {
    return (
        <nav className="topnavbar">
            {/* Conditional Top Navbar Content */}
            {userType === 1 && <AdminTopNavbar />}
            {userType === 2 && <SellerTopNavbar />}
            {userType === 3 && <BuyerTopNavbar />}

            <div className="topspacer"></div>

            {/* Search Bar */}
            <div className="topnav-search-container">
                <input
                    type="text"
                    className="topnav-search-bar"
                    placeholder="Search for Products and Shops....."
                />
            </div>

            {/* Navigation Links Container */}
            <div className="topnav-links">
                <NavLink to="/cart" className="topnav-item">
                    <div className="topnav-icon-container">
                        <IoCart className="topnav-icon-cart" />
                        <div className="cart-badge">8</div> {/* Sample number */}
                    </div>
                </NavLink>

                {/* Login/Logout Link */}
                {userType ? (
                    <NavLink to="/logout" className="topnav-item">
                        <IoLogOut className="topnav-icon" />
                        <span className="topnav-text">Logout</span>
                    </NavLink>
                ) : (
                    <NavLink to="/login" className="topnav-item">
                        <IoLogIn className="topnav-icon" />
                        <span className="topnav-text">Login</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default TopNavbar;
