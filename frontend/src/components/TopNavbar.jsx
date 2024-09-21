import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoCart, IoNotifications, IoChatboxEllipses } from 'react-icons/io5';
import AdminTopNavbar from './TopNavbar/AdminTopNavbar';
import SellerTopNavbar from './TopNavbar/SellerTopNavbar';
import BuyerTopNavbar from './TopNavbar/BuyerTopNavbar';
import ProfileDropdown from './TopNavbar/TopNavTemplates/ProfileDropdown';
import NotificationDropdown from './NotificationModal';
import ChatModal from './ChatModal';
import { io } from 'socket.io-client';

const socket = io();

function TopNavbar({ userType, userId, refreshProfile }) {
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);

    const location = useLocation();
    const chatIdInUrl = location.pathname.startsWith('/chat/')
        ? parseInt(location.pathname.split('/').pop(), 10)
        : null;

    useEffect(() => {
        if (!userId) return;

        const fetchUnreadMessages = async () => {
            try {
                const chatResponse = await fetch(`/api/chats/u`, {
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
                });

                if (chatResponse.ok) {
                    const chats = await chatResponse.json();
                    const unreadMessages = chats.filter(chat => chat.receiver_id === userId && !chat.is_read);
                    setUnreadCount(unreadMessages.length);
                    setHasNewMessage(unreadMessages.length > 0);
                }
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            }
        };

        fetchUnreadMessages();

        socket.on('chat message', (msg) => {
            if (msg.receiver_id === userId && !msg.is_read && msg.sender_id !== chatIdInUrl) {
                setHasNewMessage(true);
                setUnreadCount((prevCount) => prevCount + 1);
            }
        });

        return () => {
            socket.off('chat message');
        };
    }, [userId, chatIdInUrl, location.pathname]);

    const markMessagesAsRead = () => {
        setHasNewMessage(false);
        setUnreadCount(0);
    };

    const handleChatClick = () => {
        setIsChatModalOpen(true);
        markMessagesAsRead();
    };

    useEffect(() => {
        if (!userId) return;

        const fetchUnreadNotifMessages = async () => {
            try {
                const notifResponse = await fetch(`/api/notification`, {
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
                });

                if (notifResponse.ok) {
                    const notifs = await notifResponse.json();
                    const unreadNotifs = notifs.filter(notif => notif.user_id === userId && !notif.is_read);
                    setUnreadNotifCount(unreadNotifs.length);
                }
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        fetchUnreadNotifMessages();

        socket.on('notification', (notifs) => {
            if (notifs.user_id === userId && !notifs.is_read) {
                setUnreadNotifCount((prevCount) => prevCount + 1);
            }
        });

        return () => {
            socket.off('notification');
        };
    }, [userId, chatIdInUrl, location.pathname]);

    const toggleNotificationModal = () => {
        setIsNotificationModalOpen((prev) => !prev);
        if (!isNotificationModalOpen) {
            setUnreadNotifCount(0); // Reset count when opening the modal
        }
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

                <div className="topnav-item relative" onClick={toggleNotificationModal}>
                    <span className="topnav-icon-container">
                        <IoNotifications
                            className={`topnav-icon-chat ${unreadNotifCount > 0 ? 'text-red-500' : ''}`}
                        />
                        {unreadNotifCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadNotifCount}
                            </span>
                        )}
                    </span>
                </div>

                <div className="topnav-item relative" onClick={handleChatClick}>
                    <span className="topnav-icon-container">
                        <IoChatboxEllipses
                            className={`topnav-icon-chat ${hasNewMessage ? 'text-red-500' : ''}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </span>
                </div>

                <ProfileDropdown key={refreshProfile} />
            </div>

            {isChatModalOpen && (
                <ChatModal
                    isOpen={isChatModalOpen}
                    onMessagesRead={markMessagesAsRead}
                    onClose={() => setIsChatModalOpen(false)}
                    userId={userId}
                />
            )}

            {isNotificationModalOpen && (
                <NotificationDropdown
                    userId={userId}
                    isOpen={isNotificationModalOpen}
                    onClose={toggleNotificationModal}
                />
            )}
        </nav>
    );
}

export default TopNavbar;
