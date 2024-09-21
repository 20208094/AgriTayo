import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;

let socket;

function ChatModal({ isOpen, onClose, userId }) {
    const [users, setUsers] = useState([]);
    const [newMessageUsers, setNewMessageUsers] = useState(new Set());
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userId) return;

            try {
                const chatResponse = await fetch(`/api/chats`, {
                    headers: { 'x-api-key': API_KEY }
                });

                if (chatResponse.ok) {
                    const chats = await chatResponse.json();
                    const uniqueUsers = Array.from(new Set(
                        chats.map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
                    ));

                    const userResponse = await fetch('/api/users', {
                        headers: { 'x-api-key': API_KEY }
                    });
                    if (userResponse.ok) {
                        const usersData = await userResponse.json();
                        const chatUsers = uniqueUsers.map(id => usersData.find(user => user.user_id === id));
                        setUsers(chatUsers);
                    }

                    const unreadMessages = chats.filter(chat => chat.receiver_id === userId && !chat.is_read);
                    const usersWithNewMessages = new Set(unreadMessages.map(chat => chat.sender_id));
                    setNewMessageUsers(usersWithNewMessages);
                } else {
                    console.error('Failed to fetch chats:', chatResponse.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
            }
        };

        fetchUsers();

        // Setup WebSocket
        socket = io();
        socket.on('chat message', (msg) => {
            if (msg.receiver_id === userId && !msg.is_read) {
                setNewMessageUsers(prev => new Set(prev).add(msg.sender_id));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const handleUserClick = (id) => {
        navigate(`/chat/${id}`);
        onClose(); // Close modal on user click
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>
                    <IoClose />
                </button>
                <h2>Your Chats</h2>
                {error && <p className="text-red-500">{error}</p>}
                <ul>
                    {users.map(user => (
                        <li
                            key={user.user_id}
                            className={`chat-user ${newMessageUsers.has(user.user_id) ? 'new-message' : ''}`}
                            onClick={() => handleUserClick(user.user_id)}
                        >
                            {/* <img src={user.user_image_url || 'default-avatar.png'} alt={`${user.user_name}'s avatar`} /> */}
                            <div>
                                <p>{user.firstname}</p>
                                {newMessageUsers.has(user.user_id) && <p className="new-message-label">New message</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatModal;
