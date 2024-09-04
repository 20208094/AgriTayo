import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserSessionAndInitializeSocket = async () => {
            try {
                const response = await fetch('/api/session', {
                    headers: {
                        'x-api-key': API_KEY
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user_id) {
                        setUserId(data.user_id);

                        // Initialize socket connection
                        const socketInstance = io({
                            transports: ['websocket'], // Ensure WebSocket transport is used
                        });

                        setSocket(socketInstance);

                        // Register socket event listeners
                        socketInstance.on('chat message', (msg) => {
                            setMessages(prevMessages => [...prevMessages, msg]);
                        });

                        socketInstance.on('connect', () => {
                            console.log('Connected to chat server:', socketInstance.id);
                        });

                        socketInstance.on('disconnect', () => {
                            console.log('Disconnected from chat server');
                        });

                        // Cleanup function for socket connection
                        return () => {
                            socketInstance.off('chat message'); // Remove event listener to prevent duplicates
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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            const message = {
                user_id: userId,
                text: newMessage
            };
            socket.emit('chat message', message);
            setNewMessage('');
        }
    };

    return (
        <div className="chat-page-container">
            <div className="chat-box">
                <h2>Chat Room</h2>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>User {msg.user_id === userId ? 'You' : msg.user_id}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <form className="chat-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="chat-input"
                        required
                    />
                    <button type="submit" className="chat-button">Send</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default ChatPage;
