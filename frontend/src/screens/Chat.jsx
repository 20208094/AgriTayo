import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa'; // Import icon
import { IoIosAttach } from 'react-icons/io'; // Import attach icon

const API_KEY = import.meta.env.VITE_API_KEY;

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const { receiverId } = useParams();
    const navigate = useNavigate();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Function to scroll to the bottom of the chat when new messages are added
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        scrollToBottom(); // Call when the messages change (new message is added)
    }, [messages]); // Listen for changes in the messages array



    useEffect(() => {
        const fetchUserSessionAndInitializeSocket = async () => {
            try {
                const response = await fetch('/api/session', {
                    headers: { 'x-api-key': API_KEY }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user_id) {
                        setUserId(data.user_id);

                        const socketInstance = io({
                            transports: ['websocket'],
                        });

                        setSocket(socketInstance);

                        socketInstance.on('connect', () => {
                            console.log('Connected to chat server:', socketInstance.id);
                        });

                        socketInstance.on('disconnect', () => {
                            console.log('Disconnected from chat server');
                        });

                        socketInstance.on('chat message', (msg) => {
                            setMessages(prevMessages => [...prevMessages, msg]);
                        });

                        return () => {
                            socketInstance.off('chat message');
                            socketInstance.disconnect();
                        };
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

        fetchUserSessionAndInitializeSocket();
    }, [navigate]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userId && receiverId) {
                try {
                    const response = await fetch(`/api/chats?receiver_id=${receiverId}`, {
                        headers: { 'x-api-key': API_KEY }
                    });

                    if (response.ok) {
                        const allMessages = await response.json();
                        setMessages(allMessages);
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
                    console.log('Message saved to DB:', savedMessage.data);
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

    const userIdStr = String(userId);
    const receiverIdStr = String(receiverId);

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
                            {!isSentByUser && (
                                <div className="avatar">
                                    <img src="/default-avatar.png" alt="User Avatar" />
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
