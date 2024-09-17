// src/components/NotificationList.jsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationList = ({ userId }) => {
    const notifications = useNotifications(userId);

    return (
        <div className="notification-list">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className={`notification ${notification.is_read ? 'read' : 'unread'}`}>
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

export default NotificationList;
