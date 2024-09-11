import React, { useState } from 'react';
import SidebarItem from './Sidebar/SidebarTemplates/SidebarItem';
import { IoLogIn, IoLogOut, IoPin, IoPinOutline } from 'react-icons/io5'; // Add icons for pinning
import { FaDev } from "react-icons/fa6";
import AdminSidebar from './Sidebar/AdminSidebar';
import SellerSidebar from './Sidebar/SellerSidebar';
import BuyerSidebar from './Sidebar/BuyerSidebar';
import LogoutModal from './LogoutModal'; // Import the new LogoutModal component
import { useNavigate } from 'react-router-dom';
import { RiPushpinFill, RiUnpinFill } from "react-icons/ri";

function LeftSidebar({ userType }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isPinned, setIsPinned] = useState(false); // New state for pinning
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        navigate('/logout');  // Navigate to the logout page
    };

    const handlePinToggle = () => {
        setIsPinned(prev => !prev); // Toggle pin state
    };

    return (
        <div className={`sidebar ${isPinned ? 'pinned' : ''}`}>
            {/* Logo */}
            <div className='TitleContainer'>
                <div className="flex items-center mb-5">
                    <img src="/AgriTayo_Logo.svg" alt="AgriTayo Logo" className="AgriTayoLogo" />
                    <h2 className="sidebar-title">AgriTayo</h2>
                </div>
            </div>

            {/* DEV LINKS */}
            <SidebarItem to="/sample" icon={FaDev} text="Sample" />
            <SidebarItem to="/crop-category" icon={FaDev} text="Crop Category" />
            <SidebarItem to="/admin-dash" icon={FaDev} text="Admin Dash" />
            <SidebarItem to="/downloadapp" icon={FaDev} text="Download App" />
            <SidebarItem to='/profile' icon={FaDev} text='Profile' />
            <SidebarItem to='/all' icon={FaDev} text='Orders' />
            <SidebarItem to='/chatlist' icon={FaDev} text='Chat List' />

            {/* Conditional Sidebar Content */}
            {userType === 1 && <AdminSidebar />}
            {userType === 2 && <SellerSidebar />}
            {userType === 3 && <BuyerSidebar />}

            {/* Login/Logout Link */}
            {userType ? (
                <>
                    <SidebarItem
                        to="#"
                        icon={IoLogOut}
                        text="Logout"
                        onClick={() => setShowLogoutModal(true)}
                    />
                    {showLogoutModal && (
                        <LogoutModal
                            onConfirm={handleConfirmLogout}
                            onCancel={() => setShowLogoutModal(false)}
                        />
                    )}
                </>
            ) : (
                <SidebarItem to="/login" icon={IoLogIn} text="Login" />
            )}

            {/* Pin Toggle Button */}
            <button onClick={handlePinToggle} className="pin-button">
                {isPinned ? <RiPushpinFill /> : <RiUnpinFill />}
            </button>
        </div>
    );
}

export default LeftSidebar;
