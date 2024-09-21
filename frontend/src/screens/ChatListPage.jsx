import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;

let socket; // Declare socket outside the component

function ChatListPage() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState(new Set());
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
                        setupWebSocket(sessionData.user_id); // Setup WebSocket connection

                        const chatResponse = await fetch(`/api/chats`, {
                            headers: { 'x-api-key': API_KEY }
                        });

                        if (chatResponse.ok) {
                            const chats = await chatResponse.json();
                            const uniqueUsers = Array.from(new Set(
                                chats.map(chat => chat.sender_id === sessionData.user_id ? chat.receiver_id : chat.sender_id)
                            ));

                            const userResponse = await fetch('/api/users', {
                                headers: { 'x-api-key': API_KEY }
                            });
                            if (userResponse.ok) {
                                const usersData = await userResponse.json();
                                const chatUsers = uniqueUsers.map(id => usersData.find(user => user.user_id === id));
                                setUsers(chatUsers);
                            }

                            // Find users with new messages
                            const unreadMessages = chats.filter(chat => chat.receiver_id === sessionData.user_id && !chat.is_read);
                            const usersWithNewMessages = new Set(unreadMessages.map(chat => chat.sender_id));
                            setNewMessageUsers(usersWithNewMessages);
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

        // Cleanup function to disconnect the socket on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [navigate]);

    const setupWebSocket = (userId) => {
        socket = io(); // Initialize socket connection
        socket.on('chat message', (msg) => {
            if (msg.receiver_id === userId && !msg.is_read) {
                setNewMessageUsers(prev => new Set(prev).add(msg.sender_id));
            }
        });
    };

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow rounded-md p-4">
                <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
                {error && <p className="text-red-500">{error}</p>}
                <ul className="divide-y divide-gray-200">
                    {users.map(user => (
                        <li
                            key={user.user_id}
                            className={`flex items-center p-4 cursor-pointer 
                                ${newMessageUsers.has(user.user_id) ? 'bg-blue-100' : 'hover:bg-gray-100'}
                            `}
                            onClick={() => handleUserClick(user.user_id)}
                        >
                            <img
                                className="w-10 h-10 rounded-full mr-4"
                                src={user.user_image_url || 'default-avatar.png'}
                                alt={`${user.user_name}'s avatar`}
                            />
                            <div>
                                <p className="text-lg font-medium">{user.firstname}</p>
                                {newMessageUsers.has(user.user_id) && (
                                    <p className="text-sm text-blue-500">New message</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatListPage;
