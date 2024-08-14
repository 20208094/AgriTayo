import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '/AgriTayo_Logo.svg'; // Adjust the path as needed

const MarketCategoryCard = ({ marketCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow m-2 w-[45%] mb-3">
      <Link to={`/market-list/${marketCategory.crop_category_name}`}>
        <div className="rounded-t-lg overflow-hidden">
          <img src={logo} alt={marketCategory.crop_category_name} className="w-full h-28" />
          <div className="p-2.5">
            <h2 className="text-base font-bold mb-1.5">{marketCategory.crop_category_name}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

function MarketPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/crop_categories');
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
    <div style={{ paddingBottom: '1rem' }}>
      <div className="flex flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <MarketCategoryCard key={category.crop_category_id} marketCategory={category} />
        ))}
      </div>
    </div>
  );
}

export default MarketPage;
