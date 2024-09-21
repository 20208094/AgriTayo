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
    const [unreadCount, setUnreadCount] = useState(0); // State to track unread messages count

    useEffect(() => {
        if (!userId) return;

        const fetchUnreadMessages = async () => {
            try {
                const chatResponse = await fetch(`/api/chats/unread`, { // Fetch unread message count from API
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
                });

                if (chatResponse.ok) {
                    const unreadMessages = await chatResponse.json();
                    setUnreadCount(unreadMessages.length); // Set the unread messages count
                    setHasNewMessage(unreadMessages.length > 0);
                }
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            }
        };

        fetchUnreadMessages(); // Fetch unread messages on component mount

        // Listen for new messages via socket
        socket.on('chat message', (msg) => {
            if (msg.receiver_id === userId && !msg.is_read) {
                setHasNewMessage(true);
                setUnreadCount((prevCount) => prevCount + 1); // Increment unread count
            }
        });

        return () => {
            socket.off('chat message'); // Cleanup on component unmount
        };
    }, [userId]);

    const handleChatClick = () => {
        setIsChatModalOpen(true);
        setHasNewMessage(false); // Reset the flag when opening the modal
        setUnreadCount(0); // Reset unread count when modal opens
    };

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

                <div className="topnav-item relative" onClick={handleChatClick}>
                    <span className="topnav-icon-container">
                        <IoChatboxEllipses
                            className={`topnav-icon-chat ${hasNewMessage}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span> // Badge with unread count
                        )}
                    </span>
                </div>

                <ProfileDropdown key={refreshProfile} />
            </div>

            {/* Chat modal should only be rendered when the modal is open */}
            {isChatModalOpen && (
                <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} userId={userId} />
            )}
        </nav>
    );
}

export default TopNavbar;
