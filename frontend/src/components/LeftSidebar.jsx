import React, { useState, useEffect } from 'react';
import SidebarItem from './Sidebar/SidebarTemplates/SidebarItem';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import { FaDev } from "react-icons/fa6";
import AdminSidebar from './Sidebar/AdminSidebar';
import SellerSidebar from './Sidebar/SellerSidebar';
import BuyerSidebar from './Sidebar/BuyerSidebar';
import LogoutModal from './LogoutModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiPushpinFill, RiUnpinFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";

function LeftSidebar({ userType }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isPinned, setIsPinned] = useState(true); // Default to pinned
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        navigate('/logout');
    };

    const handlePinToggle = () => {
        setIsPinned(prev => !prev);
    };

    const toggleSidebarVisibility = () => {
        setSidebarVisible(prev => !prev);
    };

    // Automatically pin the sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsPinned(true);
                setSidebarVisible(false); // Ensure sidebar is hidden on mobile
            } else {
                setIsPinned(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Hide sidebar on route change for mobile
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setSidebarVisible(false); // Hide sidebar on mobile when navigating
        }
    }, [location]);

    return (
        <>
            {/* Hide Button for Mobile */}
            <button 
                onClick={toggleSidebarVisibility} 
                className={`menu-toggle-button ${isSidebarVisible ? 'hidden' : ''}`}
            >
                <TiThMenu />
            </button>

            <div className={`sidebar ${isPinned ? 'pinned' : ''} ${!isSidebarVisible ? 'hidden' : ''}`}>
                <div className='TitleContainer'>
                    <div className="flex items-center mb-5">
                        {/* Hide Button beside Logo on Mobile */}
                        <button
                            onClick={toggleSidebarVisibility}
                            className={`mobile-hide-button ${isSidebarVisible ? 'hidden' : ''}`}
                        >
                            <TiThMenu />
                        </button>
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
                <button onClick={handlePinToggle} className={`pin-button ${window.innerWidth <= 768 ? 'hidden' : ''}`}>
                    {isPinned ? <RiPushpinFill /> : <RiUnpinFill />}
                </button>
            </div>
        </>
    );
}

export default LeftSidebar;
