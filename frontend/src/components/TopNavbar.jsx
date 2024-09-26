import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import AdminTopNavbar from './TopNavbar/AdminTopNavbar';
import SellerTopNavbar from './TopNavbar/SellerTopNavbar';
import BuyerTopNavbar from './TopNavbar/BuyerTopNavbar';
import NullTopNavbar from './TopNavbar/NullTopNavbar';
import NotificationDropdown from './NotificationModal';
import ChatModal from './ChatModal';

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
                const chatResponse = await fetch(`/api/chats`, {
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
                });

                if (chatResponse.ok) {
                    const chats = await chatResponse.json();
                    const unreadMessages = chats.filter(chat => chat.receiver_id === userId && !chat.is_read);
                    setUnreadCount(0);
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
        <div>
{userType === null && <NullTopNavbar />}
            {userType === 1 && (
                <AdminTopNavbar
                    unreadCount={unreadCount}
                    unreadNotifCount={unreadNotifCount}
                    hasNewMessage={hasNewMessage}
                    handleChatClick={handleChatClick}
                    toggleNotificationModal={toggleNotificationModal}
                    refreshProfile={refreshProfile}
                />
            )}
            {userType === 2 && <SellerTopNavbar />}
            {userType === 3 && <BuyerTopNavbar />}

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
        </div>
        
    );
}

export default TopNavbar;
