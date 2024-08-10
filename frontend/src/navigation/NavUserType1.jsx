import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaUser, FaShoppingCart, FaTag, FaTasks, FaCheckCircle, FaShippingFast } from 'react-icons/fa';

function NavUserType1() {
    const [showDevLinks, setShowDevLinks] = useState(false); // Define state for dropdown

    return (
        <div className="w-full">
            {/* Dev Menu Dropdown */}
            <button
                className="w-full flex items-center p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowDevLinks(!showDevLinks)}
            >
                <FaBox className="sidebar-icon" />
                <span className="sidebar-text">Dev Menu</span>
                <svg className={`ml-auto w-4 h-4 ${showDevLinks ? 'rotate-180' : 'rotate-0'} transition-transform`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`transition-all duration-300 ease-in-out ${showDevLinks ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                <NavLink
                    to="/user_type"
                    className="dropdown-item"
                >
                    <FaUser className="sidebar-icon" />
                    <span className="sidebar-text">User Type</span>
                </NavLink>
                <NavLink
                    to="/users"
                    className="dropdown-item"
                >
                    <FaUser className="sidebar-icon" />
                    <span className="sidebar-text">Users</span>
                </NavLink>
                <NavLink
                    to="/addresses"
                    className="dropdown-item"
                >
                    <FaBox className="sidebar-icon" />
                    <span className="sidebar-text">Addresses</span>
                </NavLink>
                <NavLink
                    to="/shops"
                    className="dropdown-item"
                >
                    <FaShoppingCart className="sidebar-icon" />
                    <span className="sidebar-text">Shops</span>
                </NavLink>
                <NavLink
                    to="/crop_category"
                    className="dropdown-item"
                >
                    <FaTag className="sidebar-icon" />
                    <span className="sidebar-text">Crop Category</span>
                </NavLink>
                <NavLink
                    to="/metric_system"
                    className="dropdown-item"
                >
                    <FaTasks className="sidebar-icon" />
                    <span className="sidebar-text">Metric System</span>
                </NavLink>
                <NavLink
                    to="/crops"
                    className="dropdown-item"
                >
                    <FaCheckCircle className="sidebar-icon" />
                    <span className="sidebar-text">Crops</span>
                </NavLink>
                <NavLink
                    to="/order_status"
                    className="dropdown-item"
                >
                    <FaShippingFast className="sidebar-icon" />
                    <span className="sidebar-text">Order Status</span>
                </NavLink>
            </div>
        </div>
    );
}

export default NavUserType1;
