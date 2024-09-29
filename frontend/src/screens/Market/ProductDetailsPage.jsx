import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation
const API_KEY = import.meta.env.VITE_API_KEY;

function ProductDetailsPage() {
    const { productListId } = useParams();
    const [crops, setCrops] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Used for navigation

    useEffect(() => {
        fetchCrops();
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

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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
            {filteredProductDetails.map((crop) => (
                <div key={crop.crop_id} className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img
                            src={crop.crop_image_url}
                            alt={crop.crop_name}
                            className="w-full h-auto rounded-lg object-cover mb-6"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{crop.crop_name}</h1>
                        <p className="text-xl text-green-600 font-semibold mb-2">₱ {crop.crop_price}</p>
                        <p className="text-gray-700 mb-4">Available in stock</p>
                        <p className="text-gray-700 mb-6">⭐ {crop.crop_rating} (192 reviews)</p>

                        <div className="flex items-center mb-6">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-l-lg focus:outline-none"
                                onClick={decreaseQuantity}
                            >
                                -
                            </button>
                            <span className="bg-gray-200 text-lg px-6 py-1.5">{quantity} pcs</span>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-r-lg focus:outline-none"
                                onClick={increaseQuantity}
                            >
                                +
                            </button>
                        </div>

                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">{crop.crop_description}</p>

                        {/* Shop Info Section with clickable image and buttons */}
                        <div className="border border-green-600 flex items-center justify-between border p-3 rounded-lg mb-5">
                            <div className="flex items-center">
                                {/* Clickable shop image */}
                                <img
                                    src={crop.seller?.shop_image_url || "https://via.placeholder.com/150"}
                                    alt={crop.seller?.shop_name || "Shop"}
                                    className="w-20 h-20 rounded-full object-cover cursor-pointer"
                                    onClick={() => navigate(`/seller-shop/${crop.seller?.shop_id}`)}
                                />
                                <div className="ml-6">
                                    <h3 className="text-lg font-bold">{crop.seller?.shop_name || "Unknown Shop"}</h3>
                                    <p className="text-sm text-gray-500">Active 3 Minutes Ago</p>
                                </div>
                            </div>

                            {/* Buttons positioned inside the shop info section */}
                            <div className="flex grid grid-cols-1 grid-rows-2 gap-4">
                                <button
                                    className="border border-green-600 bg-white px-20 py-1 rounded-md flex items-center justify-center text-green-600 font-bold"
                                    onClick={() => navigate(`/negotiate/${crop.seller?.shop_id}`)}
                                >
                                    Negotiate
                                </button>
                                <button
                                    className="border border-green-600 bg-white px-20 py-1 rounded-md flex items-center justify-center text-green-600 font-bold"
                                    onClick={() => navigate(`/message/${crop.seller?.shop_id}`)}
                                >
                                    Message
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg font-bold">
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Related Products</h2>
                <div className="flex space-x-4 overflow-x-auto">
                    <div className="h-40 w-40 bg-gray-200 flex justify-center items-center rounded-lg">
                        <p className="text-gray-400">Your Image Here</p>
                    </div>
                    <div className="h-40 w-40 bg-gray-200 flex justify-center items-center rounded-lg">
                        <p className="text-gray-400">Your Image Here</p>
                    </div>
                    <div className="h-40 w-40 bg-gray-200 flex justify-center items-center rounded-lg">
                        <p className="text-gray-400">Your Image Here</p>
                    </div>
                    <div className="h-40 w-40 bg-gray-200 flex justify-center items-center rounded-lg">
                        <p className="text-gray-400">Your Image Here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;
