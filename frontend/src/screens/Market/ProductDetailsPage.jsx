import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const API_KEY = import.meta.env.VITE_API_KEY;

function ProductDetailsPage() {
    const { productListId } = useParams();
    const [crops, setCrops] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shopOwnerId, setShopOwnerId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unlistReason, setUnlistReason] = useState('');
    const navigate = useNavigate();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [shopNumber, setShopNumber] = useState('');
    const [cropId, setCropId] = useState('');


    useEffect(() => {
        fetchCrops();
        fetchShops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await fetch(`/api/crops`, {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCrops(data);
        } catch (error) {
            setError(error);
            console.error('Error fetching crops:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchShops = async () => {
        try {
            const response = await fetch('/api/shops', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const handleMessageButtonClick = async (shopName) => {
        try {
            const shop = shops.find((shop) => shop.shop_name === shopName);

            if (shop && shop.shop_id) {
                navigate(`/admin/chat/${shop.shop_id}/Shop`);
            } else {
                alert('Failed to find the shop ID.');
            }
        } catch (error) {
            console.error('Error navigating to the chat page:', error);
            alert('Failed to navigate to the chat page.');
        }
    };

    const openUnlistModal = (crop_id) => {
        setCropId(crop_id);
        setIsModalOpen(true);
    };

    const closeUnlistModal = () => {
        setIsModalOpen(false);
        setUnlistReason('');
    };

    const handleUnlistSubmit = async () => {
        const availability = 'violation';
        const availability_message = unlistReason;
        
        try {
            const response = await fetch(`/api/crops_availability/${cropId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({
                    availability,
                    availability_message,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Crop availability updated successfully:', data);
            alert('Crop has been successfully updated.');
    
        } catch (error) {
            console.error('Error updating crop availability:', error);
            alert('Failed to update crop availability. Please try again.');
        }
    
        closeUnlistModal(); // Close the modal after submitting
    };
    
    const openMessageModal = (number) => {
        setShopNumber(number);
        setIsMessageModalOpen(true);
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessage(''); // Clear the message input
    };

    const handleMessageSubmit = async () => {
        const title = 'AgriTayo';
        console.log('Shop Number:', shopNumber);
        console.log('Message:', title, message);
        closeMessageModal();

        try {
            const response = await fetch('/api/sms_sender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({
                    title,
                    message,
                    phone_number: shopNumber,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('SMS sent successfully:', data);
            alert('Message sent successfully!');
    
            closeMessageModal(); // Close the modal after sending the message
        } catch (error) {
            console.error('Error sending SMS:', error);
            alert('Failed to send the message.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Loading...</div>
                    <div className="spinner-border animate-spin w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-red-500 text-lg font-semibold">
                    Error loading data: {error.message}
                </div>
            </div>
        );
    }

    const filteredProductDetails = crops.filter(
        (crop) => String(productListId) === String(crop.crop_id)
    );

    if (filteredProductDetails.length === 0) {
        return (
            <div className="text-center">
                <p>No available details</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {filteredProductDetails.map((crop) => {
                const shop = shops.find((shop) => shop.shop_id === crop.shop_id);
                const shopImageUrl = shop?.shop_image_url;

                return (
                    <div key={crop.crop_id} className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img
                                src={crop.crop_image_url}
                                alt={crop.crop_name}
                                className="w-full h-auto rounded-lg object-cover mb-6"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-gray-800 mb-4">{crop.crop_name}</h1>
                                <button
                                    className="text-sm bg-[#00B251] text-white px-4 py-2 rounded-md"
                                    onClick={() => openUnlistModal(crop.crop_id)}
                                >
                                    Mark as Unlisted
                                </button>
                            </div>
                            <p className="text-xl text-green-600 font-semibold mb-2">₱ {crop.crop_price}</p>
                            <p className="text-gray-700 mb-4">Available in stock</p>
                            <p className="text-gray-700 mb-6">⭐ {crop.crop_rating} (192 reviews)</p>

                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">{crop.crop_description}</p>

                            {/* Shop Info Section with clickable image and buttons */}
                            <div className="border border-green-600 flex items-center justify-between p-3 rounded-lg mb-5">
                                <div className="flex items-center">
                                    {shopImageUrl && (
                                        <img
                                            src={shopImageUrl}
                                            alt={shop?.shop_name || "Shop"}
                                            className="w-20 h-20 rounded-full object-cover cursor-pointer"
                                            onClick={() => navigate(`/seller-shop/${shop?.shop_id}`)}
                                        />
                                    )}
                                    <div className="ml-6">
                                        <h3 className="text-lg font-bold">{shop?.shop_name || "Unknown Shop"}</h3>
                                        <p className="text-sm text-gray-500">Active 3 Minutes Ago</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 grid-rows-2 gap-4">
                                    <button
                                        className="border border-green-600 bg-white px-20 py-1 rounded-md flex items-center justify-center text-green-600 font-bold"
                                        onClick={() => openMessageModal(shop.shop_number)}
                                    >
                                        Send SMS
                                    </button>
                                    <button
                                        className="border border-green-600 bg-white px-20 py-1 rounded-md flex items-center justify-center text-green-600 font-bold"
                                        onClick={() => handleMessageButtonClick(shop.shop_name)}
                                    >
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Unlist Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-semibold mb-4">Mark as Unlisted</h2>
                        <p className="text-gray-700 mb-4">Please provide a reason for marking this product as unlisted:</p>
                        <textarea
                            value={unlistReason}
                            onChange={(e) => setUnlistReason(e.target.value)}
                            placeholder="Enter reason..."
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                                onClick={closeUnlistModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-[#00B251] text-white rounded-md"
                                onClick={handleUnlistSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Input Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-semibold mb-4">Send Message</h2>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message..."
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md"
                                onClick={closeMessageModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-[#00B251] text-white rounded-md"
                                onClick={handleMessageSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProductDetailsPage;
