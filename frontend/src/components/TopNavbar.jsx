import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoLogIn, IoLogOut, IoCart } from 'react-icons/io5'; // Ensure IoCart is imported
import AdminTopNavbar from './TopNavbar/AdminTopNavbar';
import SellerTopNavbar from './TopNavbar/SellerTopNavbar';
import BuyerTopNavbar from './TopNavbar/BuyerTopNavbar';
import ProfileDropdown from './TopNavbar/TopNavTemplates/ProfileDropdown';

function TopNavbar({ userType, refreshProfile }) {
    console.log(refreshProfile)
    return (
        <nav className="flex items-center justify-between bg-[#eefff4] border-[#00b250] text-[#01a149] z-[1000] px-5 h-12 border-b w-full fixed top-0 left-0 box-border md:h-16">
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
                        <div className="cart-badge">8</div>
                    </div>
                </NavLink>

                <ProfileDropdown key={refreshProfile}/>
            </div>
        </nav>
    );
}

export default TopNavbar;
