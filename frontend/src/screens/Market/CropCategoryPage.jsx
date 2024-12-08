import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const API_KEY = import.meta.env.VITE_API_KEY;

const CropCategoryCard = ({ cropCategory }) => {
  return (
    <Link 
      to={`/admin/crop-subcategory/${cropCategory.crop_category_id}`}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl 
        transform transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={cropCategory.crop_category_image_url}
            alt={cropCategory.crop_category_name}
            className="w-full h-48 object-cover object-center transform transition-transform 
              duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
          group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600 
            transition-colors duration-300">
            {cropCategory.crop_category_name}
          </h2>
          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 
            transform group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

function CropCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crop_categories', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error);
      console.error('Error fetching crop categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.crop_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] 
        flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex items-center space-x-4">
          <div className="animate-spin h-8 w-8 text-white">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)] 
        flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-red-500 flex justify-center mb-6">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Error Loading Categories</h3>
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                        Product Categories
                    </h1>
                    <p className="text-gray-700 text-lg font-medium">
                        Browse through our selection of product varieties
                    </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                        <span className="text-gray-800 font-medium">
                            {categories.length} Categories
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full mb-6">
              <input
                type="text"
                placeholder="Search categories..."
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

        {/* Grid - Update to use filteredCategories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CropCategoryCard key={category.crop_category_id} cropCategory={category} />
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-800 text-lg">No categories found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropCategoryPage;