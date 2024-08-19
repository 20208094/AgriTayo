import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        message: ''
    });

    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, []);

    const fetchNotifications = async () => {
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
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotifications();
            setFormData({ user_id: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Notifications Management</h1>

            <form onSubmit={handleSubmit}>
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                            {user.firstname} {user.lastname}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Notification Message"
                    required
                />
                <button type="submit">Create Notification</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Message</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Read</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Notification Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification) => (
                        <tr key={notification.notification_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{notification.notification_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {users.find((user) => user.user_id === notification.user_id)?.firstname} {users.find((user) => user.user_id === notification.user_id)?.lastname}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{notification.message}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{notification.is_read ? 'Yes' : 'No'}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(notification.notification_date).toLocaleString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleMarkAsRead(notification.notification_id)}>Mark as Read</button>
                                <button onClick={() => handleDelete(notification.notification_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NotificationsPage;
