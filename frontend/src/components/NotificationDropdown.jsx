// src/components/NotificationDropdown.jsx
import React from 'react';
import useNotifications from '../hooks/useNotifications';

const NotificationDropdown = ({ userId }) => {
    const notifications = useNotifications(userId);

    return (
        <div className="notification-dropdown">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.notification_id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.created_at).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
};

export default NotificationDropdown;
