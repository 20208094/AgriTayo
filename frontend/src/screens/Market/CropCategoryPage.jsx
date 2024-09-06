import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const CropCategoryCard = ({ cropCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <Link to={`/crop-subcategory/${cropCategory.crop_category_id}`}>
        <div className="rounded-t-lg overflow-hidden">
          <img src={cropCategory.crop_category_image_url} alt={cropCategory.crop_category_name} className="w-full h-28" />
          <div className="p-2.5">
            <h2 className="text-base font-bold mb-1.5">{cropCategory.crop_category_name}</h2>
          </div>
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
          'x-api-key': API_KEY // Include the API key in the request headers
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Categories:', data); // Debugging the data
      setCategories(data);
    } catch (error) {
      console.error('Error fetching crop categories:', error);
    }
  };

  return (
    <div style={{ paddingBottom: '1rem' }}>
      <div className="flex flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <CropCategoryCard key={category.crop_category_id} cropCategory={category} />
        ))}
      </div>
    </div>
  );
}

export default CropCategoryPage;
