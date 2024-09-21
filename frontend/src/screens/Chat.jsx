import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { IoIosAttach } from 'react-icons/io';

const API_KEY = import.meta.env.VITE_API_KEY;

let socket; // Declare socket outside the component

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [senderData, setSenderData] = useState(null); // Sender data state
    const [receiverData, setReceiverData] = useState(null); // Receiver data state
    const [newMessage, setNewMessage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const receiverIdNum = Number(receiverId);

    useEffect(() => {
        // Initialize socket connection
        socket = io();

        // Listen for incoming messages
        socket.on('chat message', (msg) => {
            const isMessageForThisChat =
                (msg.sender_id === userId && msg.receiver_id === receiverIdNum) ||
                (msg.receiver_id === userId && msg.sender_id === receiverIdNum);

            if (isMessageForThisChat) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });

        return () => {
            socket.off('chat message'); // Clean up the listener
            markMessagesAsRead();
            socket.disconnect(); // Disconnect socket on unmount
        };
    }, [userId, receiverId]);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch('/api/session', {
                    headers: { 'x-api-key': API_KEY }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user_id) {
                        setUserId(data.user_id);
                    } else {
                        navigate('/login');
                    }
                } else {
                    console.error('Failed to fetch user session:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setError('Failed to fetch user session. Please try again.');
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
                const usersData = await response.json();
                setUsers(usersData);
                
                // Set sender and receiver data
                const sender = usersData.find(user => user.user_id === userId);
                const receiver = usersData.find(user => user.user_id === receiverIdNum);

                setSenderData(sender);
                setReceiverData(receiver);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUserSession();
        fetchUsers();
    }, [navigate, userId, receiverIdNum]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userId && receiverId) {
                try {
                    const response = await fetch(`/api/chats`, {
                        headers: { 'x-api-key': API_KEY }
                    });

                    if (response.ok) {
                        const allMessages = await response.json();
                        const filteredMessages = allMessages.filter(message =>
                            (message.sender_id === userId || message.receiver_id === userId) &&
                            (message.sender_id === receiverIdNum || message.receiver_id === receiverIdNum)
                        );
                        setMessages(filteredMessages);

                        markMessagesAsRead();
                    } else {
                        console.error('Failed to fetch messages:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [userId, receiverId]);

    const markMessagesAsRead = async (unreadMessages) => {
        const senderId = receiverId
        const url = `/api/chats/read`;
        const method = 'PUT';
        const bodyData = JSON.stringify({ sender_id: senderId, user_id: userId });
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: bodyData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };
    

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim() || newImage) {
            const formData = new FormData();
            formData.append('sender_id', userId);
            formData.append('receiver_id', receiverId);
            formData.append('chat_message', newMessage);
            formData.append('receiver_type', 'User');
            if (newImage) {
                formData.append('image', newImage);
            }

            try {
                const response = await fetch('/api/chats', {
                    method: 'POST',
                    headers: { 'x-api-key': API_KEY },
                    body: formData
                });

                if (response.ok) {
                    const savedMessage = await response.json();
                    setNewMessage('');
                    setNewImage(null);
                } else {
                    console.error('Failed to send message:', response.statusText);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    return (
        <div className="chat-page-container">
            <h2 className="chat-header">Chat with User {receiverId}</h2>
            <div className="chat-messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isSentByUser = msg.sender_id === userId;

                        return (
                            <div
                                key={index}
                                className={`chat-message ${isSentByUser ? 'sent' : 'received'}`}
                            >
                                {!isSentByUser && receiverData && (
                                    <div className="avatar">
                                        <img src={receiverData.user_image_url} alt="User Avatar" />
                                    </div>
                                )}
                                <div className="message-content">
                                    {msg.chat_message}
                                    {msg.chat_image_url && (
                                        <img
                                            src={msg.chat_image_url}
                                            alt="Chat Image"
                                            className="chat-image"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No messages to display</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-form" onSubmit={handleSendMessage} encType="multipart/form-data">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="chat-input"
                />
                <div className="file-input-wrapper">
                    <label htmlFor="chat-image-input" className="attach-icon">
                        <IoIosAttach />
                    </label>
                    <input
                        type="file"
                        id="chat-image-input"
                        onChange={handleImageChange}
                        className="chat-image-input"
                    />
                </div>
                <button type="submit" className="chat-button">
                    <FaPaperPlane />
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ChatPage;
