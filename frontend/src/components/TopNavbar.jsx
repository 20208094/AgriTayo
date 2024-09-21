import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { IoCart, IoNotifications, IoChatboxEllipses } from 'react-icons/io5';
import AdminTopNavbar from './TopNavbar/AdminTopNavbar';
import SellerTopNavbar from './TopNavbar/SellerTopNavbar';
import BuyerTopNavbar from './TopNavbar/BuyerTopNavbar';
import ProfileDropdown from './TopNavbar/TopNavTemplates/ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import ChatModal from './ChatModal'; // Import the ChatModal component
import { io } from 'socket.io-client';

const socket = io();

function TopNavbar({ userType, userId, refreshProfile }) {
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Listen for new messages
        socket.on('chat message', (msg) => {
            if (msg.receiver_id === userId && !msg.is_read) {
                setHasNewMessage(true); // Set the flag if the message is unread
            }
        });

        return () => {
            socket.off('chat message'); // Cleanup on component unmount
        };
    }, [userId]);

    return (
        <nav className="flex items-center justify-between bg-[#eefff4] border-[#00b250] text-[#01a149] z-[1000] px-5 h-12 border-b w-full fixed top-0 left-0 box-border md:h-16">
            {userType === 1 && <AdminTopNavbar />}
            {userType === 2 && <SellerTopNavbar />}
            {userType === 3 && <BuyerTopNavbar />}

            <div className="topspacer"></div>

            <div className="topnav-search-container">
                <input
                    type="text"
                    className="topnav-search-bar"
                    placeholder="Search for Products and Shops....."
                />
            </div>

            <div className="topnav-links">
                <NavLink to="/cart" className="topnav-item">
                    <div className="topnav-icon-container">
                        <IoCart className="topnav-icon-cart" />
                        <div className="cart-badge">8</div>
                    </div>
                </NavLink>

                <div className="topnav-item">
                    <div className="topnav-icon-container">
                        <IoNotifications className="topnav-icon-notifications" />
                        <NotificationDropdown userId={userId} />
                    </div>
                </div>

                <div className="topnav-item" onClick={() => {
                    setIsChatModalOpen(true);
                    setHasNewMessage(false); // Reset the new message flag when opening the modal
                }}>
                    <span className="topnav-icon-container">
                        <IoChatboxEllipses
                            className={`topnav-icon-chat ${hasNewMessage ? 'text-red-500' : 'text-[#01a149]'}`} // Change color based on state
                        />
                    </span>
                </div>

                <ProfileDropdown key={refreshProfile} />
            </div>

            <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} userId={userId} />
        </nav>
    );
}

export default TopNavbar;
