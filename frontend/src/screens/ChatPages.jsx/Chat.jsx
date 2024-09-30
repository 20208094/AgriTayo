import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { IoIosImage } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi"; // For search icon
import { HiMenuAlt1 } from "react-icons/hi"; // For hamburger icon
import { IoMdClose } from "react-icons/io"; // For close icon

const API_KEY = import.meta.env.VITE_API_KEY;
let socket;

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For filtering users
  const [newMessageUsers, setNewMessageUsers] = useState(new Set());
  const [senderData, setSenderData] = useState(null);
  const [receiverData, setReceiverData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [fullImageView, setFullImageView] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar dropdown toggle for mobile

  const { receiverId, receiverType } = useParams();
  const receiverIdNum = Number(receiverId);
  const senderType = 'User'

  useEffect(() => {
    socket = io();

    socket.on('activeUsers', (users) => {
      console.log('Active users:', users);
      setActiveUsers(users);
    });

    socket.on("chat message", (msg) => {
      const isMessageForThisChat =
        (msg.sender_id === userId && msg.receiver_id === receiverIdNum && msg.receiver_type === receiverType && msg.sender_type === senderType) ||
        (msg.receiver_id === userId && msg.sender_id === receiverIdNum && msg.receiver_type === senderType && msg.sender_type === receiverType);

      // Check if the incoming message is unread
      const unreadCount = !msg.is_read && msg.receiver_id === userId;
      console.log("unr:", unreadCount);

      // If there's an unread message, mark it as read
      if (unreadCount !== 0) {
        console.log("Executing mark as read for socket message");
        markMessagesAsRead();
      }

      // If the message belongs to the current chat, add it to the list
      if (isMessageForThisChat) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.off("chat message");
      socket.off("activeUsers");
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
        setFilteredUsers(usersData); // Initialize filteredUsers with all users

        const sender = usersData.find((user) => user.user_id === userId);
        const receiver = usersData.find((user) => user.user_id === receiverIdNum);

        setSenderData(sender);
        setReceiverData(receiver);

        // Check for unread messages
        const chatResponse = await fetch(`/api/chats`, {
          headers: { "x-api-key": API_KEY },
        });

        if (chatResponse.ok) {
          const chats = await chatResponse.json();
          const unreadMessages = chats.filter(
            (chat) => chat.receiver_id === userId && !chat.is_read
          );
          const usersWithNewMessages = new Set(
            unreadMessages.map((chat) => chat.sender_id)
          );
          setNewMessageUsers(usersWithNewMessages);
        }
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
        console.log("u:", userId, receiverId);
        try {
          const response = await fetch(`/api/chatsId/${userId}/${receiverId}/${receiverType}/${senderType}`, {
            headers: { "x-api-key": API_KEY },
          });

          if (response.ok) {
            const allMessages = await response.json();
            const sortedMessages = allMessages.sort(
              (a, b) => a.chat_id - b.chat_id
            );

            setMessages(sortedMessages);

            const unreadCount = sortedMessages.filter(
              (message) => !message.is_read && message.receiver_id === userId
            ).length;
            console.log("unread:", unreadCount);
            console.log("Unread messages count:", unreadCount);
            console.log("messages 2:", allMessages);
            if (unreadCount !== 0) {
              console.log("Executing mark as read");
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
      formData.append("sent_at", new Date());
      if (newImage) {
        formData.append("image", newImage);
      }

      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { "x-api-key": API_KEY },
          body: formData,
        });

        if (response.ok) {
          setNewMessage("");
          setNewImage(null);
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleImageClick = (imageUrl) => {
    setFullImageView(imageUrl);
  };

  const closeFullImageView = () => {
    setFullImageView(null);
  };

  const removeImage = () => {
    setNewImage(null);
  };

  
  useEffect(() => {
    const checkActiveUsers = () => {
      if (activeUsers.length === 0) {
        // Re-fetch active users or emit an event to update them
        socket.emit("requestActiveUsers"); // Assuming you have this event set up in the server
        socket.on('activeUsers', (users) => {
          setActiveUsers(users); // Update the active users state
      });
      }
    };

    // Check active users every 5 seconds
    const intervalId = setInterval(checkActiveUsers, 5000);
    return () => clearInterval(intervalId);
  }, [activeUsers]);

  const isOnline = (userid) => {
    console.log("Active Users:", activeUsers, "Type:", typeof activeUsers, "Is Array:", Array.isArray(activeUsers));  // Logs contents, data type, and whether activeUsers is an array
  
    // Convert userid to a string before checking if it's included in activeUsers
    return activeUsers.includes(String(userid)) ? "Online" : "Offline";
  };

  // Filter users based on search term
  useEffect(() => {
    const results = users.filter((user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-3.5 bg-gray-100">
      {/* Left Sidebar: User List */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 bg-white p-4 shadow-md mt-4 transition-transform duration-300 ease-in-out fixed md:relative ${
          isSidebarOpen ? "top-0" : "top-[-100vh]"
        } md:top-auto z-10`}
      >

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Inbox</h2>
          <button
            className="md:hidden text-green-600 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <IoMdClose size={24} /> : <HiMenuAlt1 size={24} />}
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm text-gray-600"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>

        {/* Scrollable User List */}
        <ul className="divide-y divide-gray-300 overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredUsers.map((user) => (
            <li
              key={user.user_id}
              className="flex items-center p-3 hover:bg-green-200 cursor-pointer text-green-600"
              onClick={() => {
                setIsSidebarOpen(false);
                navigate(`/admin/chat/${user.user_id}/User`);
              }}
            >
              <img
                src={user.user_image_url || "default-avatar.png"}
                alt={`${user.firstname}'s avatar`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="font-medium">{user.firstname}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {newMessageUsers.has(user.user_id) ? "New message" : ""}
                  </p>
                  <p className="text-sm text-gray-500">{isOnline(user.user_id)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-100 flex flex-col justify-between mt-4">
        {/* Header */}
        {receiverData && (
          <div className="flex items-center bg-white p-4 shadow-sm">
            <img
              src={receiverData.user_image_url || "default-avatar.png"}
              alt="Receiver Avatar"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold text-lg text-green-600">
                {receiverData.firstname}
              </h3>
              <p className="text-sm text-gray-500">
                {/* Show online/offline status */}
                {isOnline(receiverData.user_id)}
              </p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-scroll">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSentByUser = msg.sender_id === userId;
              return (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    isSentByUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSentByUser && (
                    <img
                      src={
                        receiverData?.user_image_url || "default-avatar.png"
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div className="flex flex-col items-end">
                    <div
                      className={`rounded-lg p-4 max-w-xs ${
                        isSentByUser
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      } break-words relative`}
                    >
                      <p>{msg.chat_message}</p>
                      {msg.chat_image_url && (
                        <img
                          src={msg.chat_image_url}
                          alt="Sent"
                          className="mt-2 max-w-60 cursor-pointer"
                          onClick={() => handleImageClick(msg.chat_image_url)}
                        />
                      )}
                    </div>
                    {/* Timestamp aligned to bottom of chat bubble */}
                    <p className="text-xs mt-1 text-gray-500">
                      {new Date(msg.sent_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center bg-white p-4"
        >
          {newImage && (
            <div className="relative">
              <img
                src={URL.createObjectURL(newImage)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-green-600 text-white rounded-full p-1"
                onClick={removeImage}
              >
                <IoClose size={18} />
              </button>
            </div>
          )}
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-4"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-green-600 hover:text-green-600 mr-4"
          >
            <IoIosImage size={24} />
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
          >
            <FaPaperPlane />
          </button>
        </form>

        {/* Full Image View */}
        {fullImageView && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={closeFullImageView}
          >
            <img
              src={fullImageView}
              alt="Full View"
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
