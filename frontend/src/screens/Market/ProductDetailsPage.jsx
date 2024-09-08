import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ProductDetailsPage() {
    const { productListId } = useParams();
    const [crops, setCrops] = useState([]);
    const [quantity, setQuantity] = useState(1);  // For quantity management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="container mx-auto p-4">
            {crops.map((crop) => {
                if (String(productListId) === String(crop.crop_id)) {
                    return (
                        <div key={crop.crop_id} className="bg-white p-6 rounded-lg shadow-lg">
                            <img
                                src={crop.crop_image_url}
                                alt={crop.crop_name}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold">{crop.crop_name}</h1>
                                <p className="text-lg text-green-600 font-bold">₱ {crop.crop_price}</p>
                            </div>
                            <p className="text-green-600 font-bold mb-4">Available in stock</p>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-700">⭐ {crop.crop_rating} (192 reviews)</p>
                                <div className="flex items-center">
                                    <button
                                        className="bg-green-600 text-white px-3 py-2 rounded-lg"
                                        onClick={decreaseQuantity}
                                    >
                                        -
                                    </button>
                                    <span className="mx-3 text-lg">{quantity} pcs</span>
                                    <button
                                        className="bg-green-600 text-white px-3 py-2 rounded-lg"
                                        onClick={increaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold mb-2">Description</h2>
                            <p className="text-gray-700 mb-5">{crop.crop_description}</p>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold">
                                    Shop
                                </button>
                                <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold">
                                    Negotiate
                                </button>
                                <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold">
                                    Message
                                </button>
                            </div>

                            <h2 className="text-lg font-bold mb-4">Related Products</h2>
                            <div className="flex space-x-4 overflow-x-auto">
                                {/* Replace with dynamic images */}
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

                            <button
                                className="bg-green-600 text-white px-4 py-3 mt-5 rounded-lg font-bold w-full"
                            >
                                Add to Cart
                            </button>
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default ProductDetailsPage;
