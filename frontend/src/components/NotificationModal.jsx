import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;
let socket;

function NotificationDropdown({ userId, isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [view, setView] = useState('unread');

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                {/* Header Section */}
                <div className="relative border-b border-gray-100">
                    {/* Close button */}
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Close notifications"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>

                    {/* Tabs */}
                    <div className="flex">
                        {['unread', 'read'].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200
                                    ${view === tab 
                                        ? 'text-green-600 border-b-2 border-green-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setView(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Button Section */}
                <div className="p-4 bg-gray-50">
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 
                            transition-colors duration-200 font-medium text-sm focus:outline-none 
                            focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={markAllAsRead}
                    >
                        Mark All as Read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
                    {notifications.length > 0 ? (
                        notifications
                            .filter((notif) => (view === 'unread' ? !notif.is_read : notif.is_read))
                            .map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    className={`rounded-lg p-4 transition-all duration-200 
                                        ${notification.is_read 
                                            ? 'bg-gray-50 hover:bg-gray-100' 
                                            : 'bg-green-50 hover:bg-green-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {notification.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <span className="mt-2 text-xs text-gray-500">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {!notification.is_read && (
                                            <button
                                                className="flex-shrink-0 text-sm font-medium text-green-600 
                                                    hover:text-green-700 transition-colors duration-200"
                                                onClick={() => markAsRead(notification.notification_id)}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">
                                No {view} notifications
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer - Optional */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-center text-gray-500">
                        You're all caught up!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NotificationDropdown;
