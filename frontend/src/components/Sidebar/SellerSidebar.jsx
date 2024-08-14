import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaUser, FaShoppingCart, FaTag, FaTasks, FaCheckCircle, FaShippingFast } from 'react-icons/fa';

function SellerSidebar() {
    const [showDevLinks, setShowDevLinks] = useState(false); // Define state for dropdown

    return (
        <div className="w-full">
            {/* Dev Menu Dropdown */}
            <button
                className="w-full flex items-center p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowDevLinks(!showDevLinks)}
            >
                <FaBox className="sidebar-icon" />
                <span className="sidebar-text">Seller Menu</span>
                <svg className={`ml-auto w-4 h-4 ${showDevLinks ? 'rotate-180' : 'rotate-0'} transition-transform`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`transition-all duration-300 ease-in-out ${showDevLinks ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                <NavLink
                    to="/seller/sample"
                    className="dropdown-item"
                >
                    <FaShoppingCart className="sidebar-icon" />
                    <span className="sidebar-text">Sample</span>
                </NavLink>
            </div>
        </div>
    );
}

export default SellerSidebar;
