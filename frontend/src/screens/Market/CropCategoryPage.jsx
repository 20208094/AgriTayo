import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const CropCategoryCard = ({ cropCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-300 m-4 hover:scale-105">
      <Link to={`/crop-subcategory/${cropCategory.crop_category_id}`}>
        <div className="rounded-t-lg overflow-hidden">
          <img
            src={cropCategory.crop_category_image_url}
            alt={cropCategory.crop_category_name}
            className="w-full h-40 md:h-56 lg:h-64 object-cover object-center transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{cropCategory.crop_category_name}</h2>
        </div>
      </Link>
    </div>
  );
};

function CropCategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/crop_categories', {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching crop categories:', error);
    }
  };

  return (
    <div className="p-6">
      {/* 4x4 Grid: 1 column on small screens, 2 on sm, 3 on md, and 4 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CropCategoryCard key={category.crop_category_id} cropCategory={category} />
        ))}
      </div>
    </div>
  );
}

export default CropCategoryPage;
