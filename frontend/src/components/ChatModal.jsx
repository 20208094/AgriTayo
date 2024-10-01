import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;

let socket;

function ChatModal({ isOpen, onClose, userId, onMessagesRead }) {
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]); // For storing shop chats
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [selectedType, setSelectedType] = useState('User'); // Default to Users Chats
    const [newMessageUsers, setNewMessageUsers] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [allShops, setAllShops] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            if (!userId) return;

            try {
                const chatResponse = await fetch(`/api/chats`, {
                    headers: { 'x-api-key': API_KEY }
                });

                if (chatResponse.ok) {
                    const chats = await chatResponse.json();
                    const uniqueUsers = Array.from(new Set(
                        chats.filter(chat => chat.sender_type === 'User' || chat.receiver_type === 'User')
                            .map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
                    ));

                    const uniqueShops = Array.from(new Set(
                        chats.filter(chat => chat.sender_type === 'Shop' || chat.receiver_type === 'Shop')
                            .map(chat => chat.sender_id === userId ? chat.receiver_id : chat.sender_id)
                    ));

                    const userResponse = await fetch('/api/users', {
                        headers: { 'x-api-key': API_KEY }
                    });
                    const shopResponse = await fetch('/api/shops', {
                        headers: { 'x-api-key': API_KEY }
                    });

                    if (userResponse.ok && shopResponse.ok) {
                        const usersData = await userResponse.json();
                        const shopsData = await shopResponse.json();

                        const chatUsers = uniqueUsers.map(id => usersData.find(user => user.user_id === id));
                        const chatShops = uniqueShops.map(id => shopsData.find(shop => shop.shop_id === id));

                        setUsers(chatUsers);
                        setAllUsers(usersData); // Set all users from the API
                        setFilteredUsers(chatUsers);
                        setShops(chatShops);
                        setAllShops(shopsData);
                        setFilteredShops(chatShops);
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

        fetchChats();

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
        navigate(`/admin/chat/${id}/User`);
        onMessagesRead(); // Reset unread count when navigating to chat
        onClose(); // Close modal on user click
    };

    const handleShopClick = (id) => {
        navigate(`/admin/chat/${id}/Shop`);
        onMessagesRead();
        onClose();
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setSearchTerm(''); // Reset search on type change
    };

    // Search filter logic
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (selectedType === 'User') {
            if (value) {
                // Search in allUsers if a search term is present
                const filtered = allUsers.filter(user =>
                    user?.firstname?.toLowerCase().includes(value)
                );
                setFilteredUsers(filtered);
            } else {
                // Reset to chat users when search term is empty
                setFilteredUsers(users);
            }
        } else {
            if (value) {
                // Search shops
                const filtered = allShops.filter(shop =>
                    shop?.shop_name?.toLowerCase().includes(value)
                );
                setFilteredShops(filtered);
            } else {
                // Reset shop list when search term is empty
                setFilteredShops(shops);
            }
        }
    };

    if (!isOpen) return null; // Don't render if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1050]">
            <div className="bg-white w-full max-w-lg mx-4 rounded-lg p-6 relative">
                <button className="absolute top-3 right-3 text-gray-600" onClick={onClose}>
                    <IoClose size={24} />
                </button>

                <div className="flex items-center mb-4 space-x-2">
                    <h2 className="text-lg font-bold">{selectedType === 'User' ? 'User Chats' : 'Shop Chats'}</h2>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="border border-gray-300 rounded-lg px-3 py-1 w-33"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}

                {/* Type Switch: Users and Shops */}
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => handleTypeChange("User")}
                        className={`flex-1 py-2 rounded-md text-center font-medium transition-colors ${selectedType === "User" ? "bg-[#00B251] text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Users Chats
                    </button>
                    <button
                        onClick={() => handleTypeChange("Shop")}
                        className={`flex-1 py-2 rounded-md text-center font-medium transition-colors ${selectedType === "Shop" ? "bg-[#00B251] text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Shops Chats
                    </button>
                </div>

                {/* Chat List */}
                <div className="max-h-80 overflow-y-auto space-y-3">
                    <ul className="space-y-3">
                        {selectedType === 'User' && filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <li
                                    key={user.user_id}
                                    className={`flex items-center justify-between p-3 border rounded-lg ${newMessageUsers.has(user.user_id) ? 'bg-green-100' : 'bg-gray-100'}`}
                                    onClick={() => handleUserClick(user.user_id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={user.user_image_url || 'default-avatar.png'}
                                            alt={`${user.firstname}'s avatar`}
                                        />
                                        <p>{user.firstname}</p>
                                    </div>
                                    {newMessageUsers.has(user.user_id) && <p className="text-green-600">New message</p>}
                                </li>
                            ))
                        ) : selectedType === 'Shop' && filteredShops.length > 0 ? (
                            filteredShops.map(shop => (
                                <li
                                    key={shop.shop_id}
                                    className={`flex items-center justify-between p-3 border rounded-lg ${newMessageUsers.has(shop.shop_id) ? 'bg-green-100' : 'bg-gray-100'}`}
                                    onClick={() => handleShopClick(shop.shop_id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={shop.shop_image_url || 'default-avatar.png'}
                                            alt={`${shop.shop_name}'s avatar`}
                                        />
                                        <p>{shop.shop_name}</p>
                                    </div>
                                    {newMessageUsers.has(shop.shop_id) && <p className="text-green-600">New message</p>}
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No {selectedType === 'User' ? 'users' : 'shops'} found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ChatModal;
