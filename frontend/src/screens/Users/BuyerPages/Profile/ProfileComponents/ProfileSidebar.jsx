import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';

const ProfileSidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="profile-sidebar h-full bg-white fixed mt-10">
            <div className="p-4">
                <h2 className="sidebar-title1">My Account</h2>
            </div>
            <ul className="sidebar-menu space-y-4">
                <li className="menu-item px-4">
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className="menu-button flex items-center py-2 rounded text-black hover:bg-gray-100 transition duration-200"
                    >
                        <FaUser className="icon mr-2" />
                        Profile
                    </button>
                </li>
                <li className="menu-item px-4">
                    <button
                        onClick={() => handleNavigation('/addresses')}
                        className="menu-button flex items-center py-2 rounded text-black hover:bg-gray-100 transition duration-200"
                    >
                        <FaMapMarkerAlt className="icon mr-2" />
                        Addresses
                    </button>
                </li>
                <li className="menu-item px-4">
                    <button
                        onClick={() => handleNavigation('/authentication')}
                        className="menu-button flex items-center py-2 rounded text-black hover:bg-gray-100 transition duration-200"

                    >
                        <FaLock className="icon mr-2" />
                        Authentication
                    </button>
                </li>
                <li className="menu-item px-4">
                    <button
                        onClick={() => handleNavigation('/deleteAccount')}
                        className="menu-button flex items-center py-2 rounded text-black hover:bg-gray-100 transition duration-200"
                    >
                        <FaShieldAlt className="icon mr-2" />
                        Delete Account
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default ProfileSidebar;
