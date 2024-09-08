import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropListPage() {
    const { cropSubCategoryId } = useParams(); // Extract cropSubCategoryId from the URL
    const [crops, setCrops] = useState([]);
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

    const filteredCrops = crops.filter(
        (crop) => String(crop.sub_category_id) === String(cropSubCategoryId)
    );

    if (filteredCrops.length === 0) {
        return (
            <div className=''>
                <p className='text-center'>No available products</p>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-200 min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {crops.map((crop) => {
                    if (String(cropSubCategoryId) === String(crop.sub_category_id)) {
                        return (
                            <Link
                                key={crop.crop_id}
                                to={`/product-details/${crop.crop_id}`}
                                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center border border-gray-300"
                            >
                                <img
                                    src={crop.crop_image_url}
                                    alt={crop.crop_name}
                                    className="w-32 h-32 rounded-lg object-cover mb-4"
                                />
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{crop.crop_name}</h3>
                                    <p className="text-sm text-gray-600">{crop.crop_description}</p>
                                    <p className="text-base font-bold text-green-700 mt-2">₱ {crop.crop_price}</p>
                                    <p className="text-sm text-gray-600 mt-1">⭐ {crop.crop_rating}</p>
                                </div>
                            </Link>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default CropListPage;
