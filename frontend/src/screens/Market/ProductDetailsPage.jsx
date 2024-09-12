import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function ProductDetailsPage() {
    const { productListId } = useParams();
    const [crops, setCrops] = useState([]);
    const [quantity, setQuantity] = useState(1); // For quantity management
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

    const filteredProductDetails = crops.filter(
        (crop) => String(productListId) === String(crop.crop_id)
    )

    if (filteredProductDetails === 0) {
        return (
            <div className=''>
                <p className='text-center'>No available details</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {crops.map((crop) => {
                if (String(productListId) === String(crop.crop_id)) {
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

                                <div className="grid grid-cols-3 gap-4 mb-6">
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

                                <button className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg font-bold">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    );
                }
            })}
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
