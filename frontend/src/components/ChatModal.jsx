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

    if (!isOpen) return null; // Don't render if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1050]">
            <div className="bg-white w-full max-w-lg mx-4 rounded-lg p-6 relative">
                <button className="absolute top-3 right-3 text-gray-600" onClick={onClose}>
                    <IoClose size={24} />
                </button>
                <h2 className="text-lg font-bold mb-4">Your Chats</h2>
                {error && <p className="text-red-500">{error}</p>}
                <ul className="space-y-3">
                    {users.map(user => (
                        <li
                            key={user.user_id}
                            className={`flex items-center justify-between p-3 border rounded-lg ${newMessageUsers.has(user.user_id) ? 'bg-green-100' : 'bg-gray-100'}`}
                            onClick={() => handleUserClick(user.user_id)}
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src={user.user_image_url || 'default-avatar.png'} // Avatar logic here
                                    alt={`${user.firstname}'s avatar`}
                                />
                                <p>{user.firstname}</p>
                            </div>
                            {newMessageUsers.has(user.user_id) && <p className="text-green-600">New message</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatModal;
