import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropSubCategoryPage() {
    const { cropCategoryId } = useParams(); // Extract crop_category_id from the URL
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await fetch(`/api/crop_sub_categories`, {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched Subcategories:', data); // Debugging the data
            setSubCategories(data);
        } catch (error) {
            setError(error);
            console.error('Error fetching crop subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const cropCategoryIdstr = String(cropCategoryId);

    return (
        <div className="p-4 bg-gray-200">
            <div className="flex flex-col">
                {subCategories.map((subCategory) => {
                    const cropCategoryId_string = String(subCategory.crop_category_id);
                    if (cropCategoryIdstr === cropCategoryId_string) {
                        return (
                            <Link
                                key={subCategory.crop_sub_category_id}
                                to={`/product-list/${subCategory.crop_sub_category_id}`}
                                className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
                                style={{ display: 'flex', alignItems: 'start', marginBottom: '15px' }}
                            >
                                <img
                                    src={subCategory.crop_sub_category_image_url}
                                    alt={subCategory.crop_sub_category_name}
                                    className="w-24 h-24 rounded-lg mr-4"
                                    style={{ width: '100px', height: '100px', marginRight: '15px' }}
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {subCategory.crop_sub_category_name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{subCategory.crop_sub_category_description}</p>
                                </div>
                            </Link>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default CropSubCategoryPage;
