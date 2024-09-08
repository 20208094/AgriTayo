import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChatListPage() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserSessionAndUsers = async () => {
            try {
                const sessionResponse = await fetch('/api/session', {
                    headers: { 'x-api-key': API_KEY }
                });

                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    if (sessionData.user_id) {
                        setUserId(sessionData.user_id);

                        const chatResponse = await fetch(`/api/chats`, {
                            headers: { 'x-api-key': API_KEY }
                        });

                        if (chatResponse.ok) {
                            const chats = await chatResponse.json();
                            const uniqueUsers = Array.from(new Set(
                                chats.map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
                            )).map(id => ({
                                id,
                                name: id // Replace with actual user/shop names if available
                            }));

                            setUsers(uniqueUsers);
                        } else {
                            console.error('Failed to fetch chats:', chatResponse.statusText);
                        }
                    } else {
                        navigate('/login');
                    }
                } else {
                    console.error('Failed to fetch user session:', sessionResponse.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
            }
        };

        fetchUserSessionAndUsers();
    }, [navigate, userId]);

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <div className="chat-list-page-container">
            <div className="chat-list-header">
                <h2>Your Chats</h2>
            </div>
            {error && <p className="error-message">{error}</p>}
            <ul className="chat-list">
                {users.map(user => (
                    <li key={user.id} className="chat-list-item" onClick={() => handleUserClick(user.id)}>
                        {user.name ? user.name : `User ${user.id}`}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatListPage;
