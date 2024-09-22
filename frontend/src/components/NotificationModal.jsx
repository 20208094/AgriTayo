import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;
let socket;

function NotificationDropdown({ userId, isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [view, setView] = useState('unread'); // Track current view

    useEffect(() => {
        socket = io();

        // Listen for notifications
        socket.on('notification', (notif) => {
            if (notif.user_id === userId) {
                setNotifications((prevNotifications) => [...prevNotifications, notif]);
            }
        });

        // Fetch initial notifications on mount
        const fetchInitialNotifications = async () => {
            try {
                const response = await fetch('/api/notifications', {
                    headers: {
                        'x-api-key': API_KEY,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const filteredData = data.filter(notif => notif.user_id == userId);
                setNotifications(filteredData);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchInitialNotifications();

        return () => {
            socket.off('notification');
            socket.disconnect();
        };
    }, [userId]);

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            setNotifications((prev) => prev.map((notif) => 
                notif.notification_id === notificationId ? { ...notif, is_read: true } : notif
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-as-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({ user_id: userId }),
            });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({ ...notif, is_read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 max-w-full relative">
                {/* Close button in the top-right corner */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Header with Tabs */}
                <div className="flex justify-between border-b border-gray-200">
                    <button
                        className={`py-2 w-full text-center ${view === 'unread' ? 'font-bold' : 'text-gray-500'}`}
                        onClick={() => setView('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`py-2 w-full text-center ${view === 'read' ? 'font-bold' : 'text-gray-500'}`}
                        onClick={() => setView('read')}
                    >
                        Read
                    </button>
                </div>

                {/* Mark All as Read button */}
                <div className="p-4 flex justify-end">
                    <button
                        className="bg-green-600 text-white rounded px-4 py-2"
                        onClick={markAllAsRead}
                    >
                        Mark All as Read
                    </button>
                </div>

                {/* Notification list */}
                <div className="p-4 max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications
                            .filter((notif) => (view === 'unread' ? !notif.is_read : notif.is_read))
                            .map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    className={`notification-item flex justify-between items-center p-2 my-2 rounded ${notification.is_read ? 'bg-gray-100' : 'bg-blue-50'}`}
                                >
                                    <div>
                                        <p className="font-semibold">{notification.title}</p>
                                        <small className="text-gray-600">{notification.message}</small>
                                    </div>
                                    {!notification.is_read && (
                                        <button
                                            className="ml-2 text-green-600 hover:text-blue-700"
                                            onClick={() => markAsRead(notification.notification_id)}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-gray-500">No notifications</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationDropdown;
