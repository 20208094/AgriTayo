import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const API_KEY = import.meta.env.VITE_API_KEY;
let socket;

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [senderData, setSenderData] = useState(null);
    const [receiverData, setReceiverData] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [fullImageView, setFullImageView] = useState(null);
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const receiverIdNum = Number(receiverId);

    useEffect(() => {
        socket = io();

        socket.on("chat message", (msg) => {
            const isMessageForThisChat =
                (msg.sender_id === userId && msg.receiver_id === receiverIdNum) ||
                (msg.receiver_id === userId && msg.sender_id === receiverIdNum);
        
            // Check if the incoming message is unread
            const unreadCount = !msg.is_read && msg.receiver_id === userId ? 1 : 0;
            console.log('unr:',unreadCount)
            
            // If there's an unread message, mark it as read
            if (unreadCount !== 0) {
                console.log('Executing mark as read for socket message');
                markMessagesAsRead();
            }
        
            // If the message belongs to the current chat, add it to the list
            if (isMessageForThisChat) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });
        
        return () => {
            socket.off("chat message");
            socket.disconnect();
        };
    }, [userId, receiverId]);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch("/api/session", {
                    headers: { "x-api-key": API_KEY },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user_id) {
                        setUserId(data.user_id);
                    } else {
                        navigate("/login");
                    }
                } else {
                    console.error("Failed to fetch user session:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
                setError("Failed to fetch user session. Please try again.");
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users", {
                    headers: {
                        "x-api-key": API_KEY,
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const usersData = await response.json();
                setUsers(usersData);

                const sender = usersData.find((user) => user.user_id === userId);
                const receiver = usersData.find((user) => user.user_id === receiverIdNum);

                setSenderData(sender);
                setReceiverData(receiver);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUserSession();
        fetchUsers();
    }, [navigate, userId, receiverIdNum]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userId && receiverId) {
                console.log('u:',userId,receiverId)
                try {
                    const response = await fetch(`/api/chatsId/${userId}/${receiverId}`, {
                        headers: { "x-api-key": API_KEY },
                    });
    
                    if (response.ok) {
                        const allMessages = await response.json();
                        const sortedMessages = allMessages.sort((a, b) => a.chat_id - b.chat_id);
    
                        setMessages(sortedMessages);
    
                        const unreadCount = sortedMessages.filter(message => 
                            !message.is_read && message.receiver_id === userId
                        ).length;
                        console.log('unread:',unreadCount)
                        console.log('Unread messages count:', unreadCount);
                        console.log('messages 2:', allMessages);
                        if (unreadCount !== 0) {
                            console.log('Executing mark as read');
                            markMessagesAsRead();
                        }
                    } else {
                        console.error("Failed to fetch messages:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
    
        fetchMessages();
    }, [userId, receiverId]);    

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const markMessagesAsRead = async () => {
        const senderId = receiverId;
        const url = `/api/chats/read`;
        const method = "PUT";
        const bodyData = JSON.stringify({ sender_id: senderId, user_id: userId });


        try {
            console.log('tried')
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: bodyData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (newMessage.trim() || newImage) {
            const formData = new FormData();
            formData.append("sender_id", userId);
            formData.append("receiver_id", receiverId);
            formData.append("chat_message", newMessage);
            formData.append("receiver_type", "User");
            if (newImage) {
                formData.append("image", newImage);
            }
            console.log('saving to db:')
            try {
                const response = await fetch("/api/chats", {
                    method: "POST",
                    headers: { "x-api-key": API_KEY },
                    body: formData,
                });

                if (response.ok) {
                    setNewMessage("");
                    setNewImage(null);
                    console.log('saved to db:')
                } else {
                    console.error("Failed to send message:", response.statusText);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleImageClick = (imageUrl) => {
        setFullImageView(imageUrl);
    };

    const closeFullImageView = () => {
        setFullImageView(null);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-full bg-gray-100 p-4 overflow-hidden">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
                Chat with User {receiverId}
            </h2>
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-lg">
                <div className="chat-messages w-full h-96 overflow-y-scroll border border-gray-300 p-2 mb-4 rounded-lg">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const isSentByUser = msg.sender_id === userId;
                            return (
                                <div
                                    key={index}
                                    className={`chat-message mb-2 ${
                                        isSentByUser ? "sent justify-end" : "received justify-start"
                                    }`}
                                >
                                    {!isSentByUser && receiverData && (
                                        <div className="avatar mr-2">
                                            <img
                                                src={receiverData.user_image_url}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </div>
                                    )}
                                    <div
                                        className={`message-content p-2 rounded-lg ${
                                            isSentByUser
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {msg.chat_message}
                                        {msg.chat_image_url && (
                                            <img
                                                src={msg.chat_image_url}
                                                alt="Chat Image"
                                                className="w-40 mt-2 rounded-lg cursor-pointer"
                                                onClick={() =>
                                                    handleImageClick(msg.chat_image_url)
                                                }
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

                {fullImageView && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                        onClick={closeFullImageView}
                    >
                        <img
                            src={fullImageView}
                            alt="Full View"
                            className="max-w-full max-h-full"
                        />
                    </div>
                )}

                <form className="flex items-center" onSubmit={handleSendMessage}>
                    {newImage && (
                        <div className="relative mr-4">
                            <img
                                src={URL.createObjectURL(newImage)}
                                alt="Selected"
                                className="w-10 h-10 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-white text-gray-600 rounded-full p-1"
                                onClick={() => setNewImage(null)}
                            >
                                <IoClose />
                            </button>
                        </div>
                    )}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message"
                        className="chat-input flex-1 border border-gray-300 rounded-full px-4 py-2"
                    />
                    <label className="cursor-pointer">
                        <IoIosAttach className="text-2xl text-gray-600" />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-3 rounded-full ml-2"
                    >
                        <FaPaperPlane className="text-xl" />
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default ChatPage;
