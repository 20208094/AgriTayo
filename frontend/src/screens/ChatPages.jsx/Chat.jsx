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
  const [allUsers, setAllUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [newMessageUsers, setNewMessageUsers] = useState(new Set());
  const [senderData, setSenderData] = useState(null);
  const [userReceiverData, setUserReceiverData] = useState(null);
  const [shopReceiverData, setShopReceiverData] = useState(null);
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

  const [selectedType, setSelectedType] = useState(receiverType);

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
        console.log('isMessageForThisChat :', isMessageForThisChat);
        setMessages((prevMessages) => [...prevMessages, msg]);
        fetchUsersWithChats();
        fetchShopsWithChats();
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
    fetchUserSession();
  }, [navigate, userId]);

  useEffect(() => {
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
        const allUsersData = await response.json();

        const sender = allUsersData.find((user) => user.user_id === userId);
        const receiver = allUsersData.find((user) => user.user_id === receiverIdNum);

        setSenderData(sender);
        setUserReceiverData(receiver);
        if (receiverType === 'User') {
          setReceiverData(receiver);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userId, receiverIdNum]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shops", { // Make sure your API for shops is set up
          headers: {
            "x-api-key": API_KEY,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const allShopsData = await response.json();
        const receiver = allShopsData.find((shop) => shop.shop_id === receiverIdNum);

        setShopReceiverData(receiver);
        if (receiverType === 'Shop') {
          setReceiverData(receiver);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, [receiverIdNum]);

  const fetchUsersWithChats = async () => {
    console.log('fetchUsersWithChats called:', userId);

    try {
      // Fetch chats for the logged-in user
      const chatsResponse = await fetch(`/api/chatList/${userId}/User/User`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!chatsResponse.ok) {
        throw new Error("Failed to fetch chats");
      }

      const chatsData = await chatsResponse.json();
      console.log('chatsData before sorting:', chatsData);

      setAllUsers(chatsData);

      // Sort users: Non-null latest_chat_time first, then null values
      const sortedUsers = chatsData
        // Filter out null chats first
        .filter(user => user.latest_chat_time !== null)
        // Sort by latest_chat_time in descending order
        .sort((a, b) => new Date(b.latest_chat_time) - new Date(a.latest_chat_time));
        
      // Update the state with the sorted users
      setUsers(sortedUsers);
      console.log('Sorted users:', sortedUsers);

    } catch (error) {
      console.error("Error fetching users with chats:", error);
    }
  };

  useEffect(() => {


    if (userId) {
      fetchUsersWithChats();
    }
  }, [userId]);

  const fetchShopsWithChats = async () => {
    try {
      // Fetch chats for the logged-in user
      const chatsResponse = await fetch(`/api/chatShopList/${userId}/User/Shop`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!chatsResponse.ok) {
        throw new Error("Failed to fetch chats");
      }

      const chatsData = await chatsResponse.json();
      console.log('chatsData before sorting:', chatsData);

      setAllShops(chatsData);
      // Sort shops: Non-null latest_chat_time first, then null values
      // Sort shops: Non-null latest_chat_time first, then null values
      const sortedShops = chatsData
        // Filter out null chats first
        .filter(shop => shop.latest_chat_time !== null)
        // Sort by latest_chat_time in descending order
        .sort((a, b) => new Date(b.latest_chat_time) - new Date(a.latest_chat_time));



      console.log('sortedShops :', sortedShops);
      // Update the state with the sorted shops
      setShops(sortedShops);
      console.log('Sorted shops:', sortedShops);

    } catch (error) {
      console.error("Error fetching users with chats:", error);
    }
  };

  useEffect(() => {


    if (userId) {
      fetchShopsWithChats();
    }
  }, [userId]);


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
      formData.append("receiver_type", receiverType);
      formData.append("sender_type", "User");
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
    return activeUsers.includes(String(userid)) ? "Online" : "Offline";
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchTerm(""); // Clear search term when type changes
  };

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (searchTerm.trim() === "") {
      // When no search is active, use the sorted users from `users` or `shops`
      if (selectedType === "User") {
        setFilteredUsers(users);
      } else if (selectedType === "Shop") {
        setFilteredShops(shops);
      }
    } else {
      // When search is active, filter based on `allUsers` or `shops`
      if (selectedType === "User") {
        const filtered = allUsers.filter(user =>
          user.firstname && user.firstname.toLowerCase().includes(lowercasedSearchTerm) // Search within `allUsers`
        );
        setFilteredUsers(filtered);
      } else if (selectedType === "Shop") {
        const filtered = allShops.filter(shop =>
          shop.shop_name && shop.shop_name.toLowerCase().includes(lowercasedSearchTerm) // Search within `shops`
        );
        setFilteredShops(filtered);
      }
    }
  }, [searchTerm, users, allUsers, shops, selectedType]);



  return (
    <div className="flex flex-col md:flex-row h-full min-h-3.5 bg-gray-100">
      {/* Left Sidebar: User List */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 bg-white p-4 shadow-md mt-4 transition-transform duration-300 ease-in-out fixed md:relative ${isSidebarOpen ? "top-0" : "top-[-100vh]"
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
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm text-gray-600"
              placeholder={`${selectedType === "User" ? "Search users or past chats..." : "Search shops or past chats..."}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>

        {/* Scrollable List Based on Selected Type */}
        <ul className="divide-y divide-gray-300 overflow-y-auto max-h-[calc(100vh-250px)]">
          {(selectedType === "User" ? filteredUsers : filteredShops).map((item) => (
            <li
              key={item.user_id || item.shop_id} // Use appropriate id based on type
              className="flex items-center p-3 hover:bg-green-200 cursor-pointer text-green-600"
              onClick={() => {
                setIsSidebarOpen(false);
                navigate(`/admin/chat/${item.user_id || item.shop_id}/${selectedType === "User" ? "User" : "Shop"}`);
              }}
            >
              <img
                src={item.user_image_url || item.shop_image_url}
                alt={item.firstname ? `${item.firstname}'s avatar` : `${item.shop_name}'s image`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <p className="font-medium">{item.firstname || item.shop_name}</p> {/* Adjusted for shop name */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {newMessageUsers.has(item.user_id) ? "New message" : ""}
                  </p>
                  <p className="text-sm text-gray-500">{isOnline(item.user_id || item.shop_id)}</p>
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
              src={receiverData.user_image_url || receiverData.shop_image_url || "default-avatar.png"}
              alt="Receiver Avatar"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold text-lg text-green-600">
                {receiverData.firstname || receiverData.shop_name}
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
                  className={`flex mb-4 ${isSentByUser ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isSentByUser && (
                    <img
                      src={
                        receiverData?.user_image_url || receiverData.shop_image_url || "default-avatar.png"
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div className="flex flex-col items-end">
                    <div
                      className={`rounded-lg p-4 max-w-xs ${isSentByUser
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
