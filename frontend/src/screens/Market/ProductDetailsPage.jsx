import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, ChatBubbleLeftIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

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
                setModalType('error');
                setModalMessage('Failed to find the shop ID.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error navigating to the chat page:', error);
            setModalType('error');
            setModalMessage('Failed to navigate to the chat page.');
            setShowModal(true);
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
            setModalType('success');
            setModalMessage('Crop has been successfully updated.');
            setShowModal(true);
    
        } catch (error) {
            console.error('Error updating crop availability:', error);
            setModalType('error');
            setModalMessage('Failed to update crop availability. Please try again.');
            setShowModal(true);
        }
    
        closeUnlistModal();
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
            setModalType('success');
            setModalMessage('Message sent successfully!');
            setShowModal(true);
    
            closeMessageModal();
        } catch (error) {
            console.error('Error sending SMS:', error);
            setModalType('error');
            setModalMessage('Failed to send the message.');
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center">
                <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex items-center space-x-4">
                    <div className="animate-spin h-8 w-8 text-white">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold text-white">Loading product details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    <div className="text-red-500 flex justify-center mb-6">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Error Loading Product</h3>
                    <p className="text-gray-600 text-center mb-6">{error.message}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold
                            hover:bg-green-700 active:bg-green-800 transform hover:scale-[1.02]
                            transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Try Again
                    </button>
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
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        to="/admin/crop-category"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 
                            backdrop-blur-sm border border-white/30 text-white transition-all duration-200
                            hover:shadow-lg group mb-6"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to Products</span>
                    </Link>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                                Product Details
                            </h1>
                            <p className="text-white/80 text-lg font-medium">
                                View detailed information about this product
                            </p>
                        </div>
                    </div>
                </div>

                {filteredProductDetails.map((crop) => {
                    const shop = shops.find((shop) => shop.shop_id === crop.shop_id);
                    const shopImageUrl = shop?.shop_image_url;

                    return (
                        <div key={crop.crop_id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Product Image Section */}
                                <div className="p-6">
                                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                                        <img
                                            src={crop.crop_image_url}
                                            alt={crop.crop_name}
                                            className="w-full h-[400px] object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 
                                            flex items-center space-x-1 shadow-lg">
                                            <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                                            <span className="text-sm font-bold">{crop.crop_rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details Section */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{crop.crop_name}</h1>
                                            <p className="text-2xl font-bold text-green-600">₱{crop.crop_price}</p>
                                        </div>
                                        <button
                                            onClick={() => openUnlistModal(crop.crop_id)}
                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold
                                                hover:bg-red-200 transition-all duration-200"
                                        >
                                            Mark as Unlisted
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                                            <p className="text-gray-700 leading-relaxed">{crop.crop_description}</p>
                                        </div>

                                        {/* Shop Info Card */}
                                        <div className="bg-green-50 rounded-xl p-6 space-y-4">
                                            <div className="flex items-center space-x-4">
                                                {shopImageUrl && (
                                                    <img
                                                        src={shopImageUrl}
                                                        alt={shop?.shop_name}
                                                        className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500 
                                                            cursor-pointer transform hover:scale-105 transition-all duration-200"
                                                        onClick={() => navigate(`/seller-shop/${shop?.shop_id}`)}
                                                    />
                                                )}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{shop?.shop_name}</h3>
                                                    <p className="text-sm text-gray-500">Active 3 Minutes Ago</p>
                                                </div>
                                            </div>

                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => openMessageModal(shop.shop_number)}
                                                    className="flex-1 flex items-center justify-center space-x-2 bg-white 
                                                        border-2 border-green-600 text-green-600 py-2 rounded-xl font-semibold
                                                        hover:bg-green-50 transition-all duration-200"
                                                >
                                                    <PhoneIcon className="h-5 w-5" />
                                                    <span>Send SMS</span>
                                                </button>
                                                <button
                                                    onClick={() => handleMessageButtonClick(shop.shop_name)}
                                                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 
                                                        text-white py-2 rounded-xl font-semibold hover:bg-green-700 
                                                        transition-all duration-200"
                                                >
                                                    <ChatBubbleLeftIcon className="h-5 w-5" />
                                                    <span>Message</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mark as Unlisted</h2>
                        <textarea
                            value={unlistReason}
                            onChange={(e) => setUnlistReason(e.target.value)}
                            placeholder="Enter reason..."
                            className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 
                                focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            rows="4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-xl font-semibold
                                    hover:bg-gray-200 transition-all duration-200"
                                onClick={closeUnlistModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold
                                    hover:bg-green-700 transition-all duration-200"
                                onClick={handleUnlistSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Message</h2>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message..."
                            className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 
                                focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            rows="4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-xl font-semibold
                                    hover:bg-gray-200 transition-all duration-200"
                                onClick={closeMessageModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold
                                    hover:bg-green-700 transition-all duration-200"
                                onClick={handleMessageSubmit}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center justify-center mb-4">
                            {modalType === 'success' ? (
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <p className="text-center text-gray-700 mb-4">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetailsPage;
