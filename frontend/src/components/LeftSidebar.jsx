import React, { useState, useEffect } from 'react';
import SidebarItem from './Sidebar/SidebarTemplates/SidebarItem';
import SidebarTitle from './Sidebar/SidebarTemplates/SidebarTitle';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import { FaDev } from "react-icons/fa6";
import AdminSidebar from './Sidebar/AdminSidebar';
import SellerSidebar from './Sidebar/SellerSidebar';
import BuyerSidebar from './Sidebar/BuyerSidebar';
import NullSidebar from './Sidebar/NullSidebar';
import LogoutModal from './LogoutModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiPushpinFill, RiUnpinFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import io from 'socket.io-client';


const socket = io('http://localhost:8080');

function LeftSidebar({ userType }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width
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

    // Handle window resize and force a re-render when crossing 767px
    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            if (
                (windowWidth <= 767 && newWidth > 767) ||
                (windowWidth > 767 && newWidth <= 767)
            ) {
                setWindowWidth(newWidth); // This forces a re-render on crossing the breakpoint
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [windowWidth]);

    // Automatically pin the sidebar on mobile
    useEffect(() => {
        if (window.innerWidth <= 767) {
            setIsPinned(true);
            setSidebarVisible(false); // Ensure sidebar is hidden on mobile
        } else {
            setIsPinned(false);
            setSidebarVisible(true);
        }
    }, [windowWidth]);

    // Hide sidebar on route change for mobile
    useEffect(() => {
        if (window.innerWidth <= 767) {
            setSidebarVisible(false); // Hide sidebar on mobile when navigating
        }
    }, [location]);

    const sendPushNotification = () => {
        const sampleNotification = {
            user_id: 95, // Example user ID
            title: "Sample Notification Title",
            message: "This is a sample push notification message.",
            screen: "Notifications",
        };
        // Emit the notification to the socket
        socket.emit('mobilePushNotification', sampleNotification);
    };

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
                <div className='TitleContainer border-b border-[#00b250] h-12 md:h-16'>
                    <div className="flex items-center mb-5">
                        {/* Hide Button beside Logo on Mobile */}
                        <button
                            onClick={toggleSidebarVisibility}
                            className={`mobile-hide-button ${isSidebarVisible ? 'hidden' : ''}`}
                        >
                            <TiThMenu />
                        </button>
                        <img src="/AgriTayo_Logo.svg" alt="AgriTayo Logo" className="ml-14 h-10 md:h-12 md:ml-4 md:mt-1" />
                        <h2 className="sidebar-title ">AgriTayo</h2>
                    </div>
                </div>

                {/* DEV LINKS */}
                {/* <SidebarTitle text="Developer"/>
                <SidebarItem to="/sample" icon={FaDev} text="Sample" />
                <SidebarItem to="/crop-category" icon={FaDev} text="Crop Category" />
                <SidebarItem to="/admin-dash" icon={FaDev} text="Admin Dash" />
                <SidebarItem to="/download" icon={FaDev} text="Download App" />
                <SidebarItem to='/profile' icon={FaDev} text='Profile' />
                <SidebarItem to='/all' icon={FaDev} text='Orders' />
                <SidebarItem to='/chatlist' icon={FaDev} text='Chat List' /> */}
                


                {/* Conditional Sidebar Content */}
                {userType === null && <NullSidebar />}
                {userType === 1 && <AdminSidebar />}
                {userType === 2 && <SellerSidebar />}
                {userType === 3 && <BuyerSidebar />}

                {/* Login/Logout Link */}
                {userType ? (
                    <>
                    </>
                ) : (
                    <SidebarItem className='align-bottom' to="/login" icon={IoLogIn} text="Login" />
                )}

                {/* Trigger Notification Button */}
                <div className="p-4">
                    <button
                        onClick={sendPushNotification}
                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                    >
                        Trigger Notification
                    </button>
                </div>

                {/* Pin Toggle Button */}
                <button onClick={handlePinToggle} className={`pin-button ${window.innerWidth <= 767 ? 'hidden' : ''}`}>
                    {isPinned ? <RiPushpinFill /> : <RiUnpinFill />}
                </button>
            </div>
        </>
    );
}

export default LeftSidebar;
