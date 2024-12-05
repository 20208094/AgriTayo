import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_KEY = import.meta.env.VITE_API_KEY;

let socket;

// Placeholder image component
const ImageWithFallback = ({ src, alt, className }) => {
    const [error, setError] = useState(false);

    const generateInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '??';
    };

    if (error || !src) {
        return (
            <div className={`${className} bg-green-100 flex items-center justify-center`}>
                <span className="text-green-700 font-semibold text-lg">
                    {generateInitials(alt)}
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

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
                        const chatShops = uniqueShops.map(id => shopsData.find(shop => shop?.shop_id === id));

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
        setSearchTerm('');
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl transform transition-all duration-300">
                {/* Header */}
                <div className="relative border-b border-gray-100 p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Messages
                        </h2>
                        <button 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            onClick={onClose}
                            aria-label="Close chat"
                        >
                            <IoClose size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search conversations..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                                focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Chat Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-4">
                    {['User', 'Shop'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`py-2 px-4 rounded-lg font-medium transition-all duration-200
                                ${selectedType === type 
                                    ? 'bg-green-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {type} Chats
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Chat List */}
                <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
                    {selectedType === 'User' ? (
                        filteredUsers.length > 0 ? (
                            filteredUsers.map(user => user && user.user_id && (
                                <div
                                    key={user.user_id}
                                    onClick={() => handleUserClick(user.user_id)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer
                                        transition-all duration-200 hover:bg-gray-50
                                        ${newMessageUsers.has(user.user_id) ? 'bg-green-50' : 'bg-white'}
                                        border border-gray-200 hover:border-green-500`}
                                >
                                    <ImageWithFallback
                                        src={user.user_image_url}
                                        alt={user.firstname || 'User'}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {user.firstname || 'Unnamed User'}
                                        </h3>
                                        {newMessageUsers.has(user.user_id) && (
                                            <span className="text-sm text-green-600 font-medium">
                                                New message
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No users found
                            </div>
                        )
                    ) : (
                        filteredShops.length > 0 ? (
                            filteredShops.map(shop => shop && shop.shop_id && (
                                <div
                                    key={shop.shop_id}
                                    onClick={() => handleShopClick(shop.shop_id)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer
                                        transition-all duration-200 hover:bg-gray-50
                                        ${newMessageUsers.has(shop.shop_id) ? 'bg-green-50' : 'bg-white'}
                                        border border-gray-200 hover:border-green-500`}
                                >
                                    <ImageWithFallback
                                        src={shop.shop_image_url}
                                        alt={shop.shop_name || 'Shop'}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {shop.shop_name || 'Unnamed Shop'}
                                        </h3>
                                        {newMessageUsers.has(shop.shop_id) && (
                                            <span className="text-sm text-green-600 font-medium">
                                                New message
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No shops found
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatModal;
