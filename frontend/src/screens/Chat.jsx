import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newImage, setNewImage] = useState(null); // For storing the selected image
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const { receiverId } = useParams(); // Get receiverId from URL
    const navigate = useNavigate();

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

                        // Initialize socket connection
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

                        // Listen for incoming chat messages
                        socketInstance.on('chat message', (msg) => {
                            setMessages(prevMessages => [...prevMessages, msg]);
                        });

                        // Cleanup function for socket connection
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
                        setMessages(allMessages); // Store all messages
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
            formData.append('receiver_type', 'User'); // Include receiver_type field
            if (newImage) {
                formData.append('image', newImage);  // Attach the image if it exists
            }

            try {
                const response = await fetch('/api/chats', {
                    method: 'POST',
                    headers: {
                        'x-api-key': API_KEY
                    },
                    body: formData // Use formData for both image and message data
                });

                if (response.ok) {
                    const savedMessage = await response.json();
                    console.log('Message saved to DB:', savedMessage.data);

                    // Clear inputs
                    setNewMessage('');
                    setNewImage(null);  // Clear the image input
                } else {
                    console.error('Failed to send message:', response.statusText);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);  // Store the selected image file
    };

    const userIdStr = String(userId);
    const receiverIdStr = String(receiverId);

    return (
        <div className="chat-page-container">
            <h2>Chat with User {receiverId}</h2>
            <div className="chat-messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const senderIdStr = String(msg.sender_id);
                        const msgReceiverIdStr = String(msg.receiver_id);

                        const isSenderMatch = senderIdStr === userIdStr && msgReceiverIdStr === receiverIdStr;
                        const isReceiverMatch = msgReceiverIdStr === userIdStr && senderIdStr === receiverIdStr;

                        if (isSenderMatch || isReceiverMatch) {
                            return (
                                <div key={index} className="chat-message">
                                    <strong>User {senderIdStr === userIdStr ? 'You' : senderIdStr}:</strong> {msg.chat_message}
                                    {msg.chat_image_url && (
                                        <img src={msg.chat_image_url} alt="Chat Image" style={{ width: '200px', height: 'auto' }} />
                                    )}
                                </div>
                            );
                        }
                        return null;
                    })
                ) : (
                    <p>No messages to display</p>
                )}
            </div>
            <form className="chat-form" onSubmit={handleSendMessage} encType="multipart/form-data">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="chat-input"
                />
                <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="chat-image-input"
                />
                <button type="submit" className="chat-button">Send</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ChatPage;
