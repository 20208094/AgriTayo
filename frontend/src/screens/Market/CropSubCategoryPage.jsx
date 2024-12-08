import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRightIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropSubCategoryPage() {
    const { cropCategoryId } = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await fetch(`/api/crop_sub_categories`, {
                headers: { 'x-api-key': API_KEY },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSubCategories(data);
        } catch (error) {
            setError(error);
            console.error('Error fetching crop subcategories:', error);
        } finally {
            setLoading(false);
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
                    <span className="text-lg font-semibold text-white">Loading subcategories...</span>
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
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Error Loading Data</h3>
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

    const filteredSubCategories = subCategories.filter(
        (subCategory) =>
            String(subCategory.crop_category_id) === String(cropCategoryId) &&
            subCategory.crop_sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredSubCategories.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-gray-400 flex justify-center mb-6">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
                    <p className="text-gray-600 mb-6">There are currently no products in this category.</p>
                    <Link
                        to="/admin/crop-category"
                        className="inline-flex items-center justify-center space-x-2 text-green-600 hover:text-green-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to Categories</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-4xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/admin/crop-category"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 
                            backdrop-blur-sm border border-white/30 text-white transition-all duration-200
                            hover:shadow-lg group mb-6"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2 text-gray-800 font-medium  group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="text-gray-800 font-medium">Back to Categories</span>
                    </Link>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                                Product Subcategories
                            </h1>
                            <p className="text-gray-700 text-lg font-medium">
                                Browse through our selection of product varieties
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-gray-800 font-medium">
                                    {filteredSubCategories.length} Categories
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add Search Bar */}
                    <div className="relative max-w-md w-full mt-6">
                        <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm
                                border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500
                                text-gray-800 placeholder-gray-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 
                            h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-4 md:gap-6">
                    {filteredSubCategories.length > 0 ? (
                        filteredSubCategories.map((subCategory) => (
                            <Link
                                key={subCategory.crop_sub_category_id}
                                to={`/admin/product-list/${subCategory.crop_sub_category_id}`}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl 
                                    transition-all duration-200 overflow-hidden group transform hover:scale-[1.02]"
                            >
                                <div className="flex items-start p-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={subCategory.crop_sub_category_image_url}
                                            alt={subCategory.crop_sub_category_name}
                                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 
                                                transition-colors duration-200">
                                                {subCategory.crop_sub_category_name}
                                            </h3>
                                            <ChevronRightIcon className="h-6 w-6 text-gray-400 group-hover:text-green-600 
                                                transform group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                        <p className="mt-2 text-gray-600 line-clamp-2">
                                            {subCategory.crop_sub_category_description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
                            <p className="text-gray-800 text-lg">
                                No subcategories found matching "{searchQuery}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CropSubCategoryPage;
