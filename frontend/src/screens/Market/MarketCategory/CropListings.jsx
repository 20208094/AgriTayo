import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function SampleSearch() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchCrops();
    fetchCategories();
    fetchShops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [searchQuery, crops, categories, shops]);

  const fetchCrops = async () => {
    try {
      const response = await fetch('/api/crops', {
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
      console.error('Error fetching crops:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/crop_categories', {
        headers: {
          'x-api-key': API_KEY,
        },
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

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterCrops = () => {
    const query = searchQuery.trim().toLowerCase();
  
    if (query === '') {
      setFilteredCrops(crops);
      return;
    }
  
    const filtered = crops.filter(crop => {
      const category = categories.find(category => category.crop_category_id === crop.category_id) || {};
      const shop = shops.find(shop => shop.shop_id === crop.shop_id) || {};
  
      // Ensure categoryName and shopName are always strings
      const categoryName = category.crop_category_name ? category.crop_category_name.toLowerCase() : '';
      const shopName = shop.shop_name ? shop.shop_name.toLowerCase() : '';
  
      return (
        (crop.crop_name && crop.crop_name.toLowerCase().includes(query)) ||
        (crop.crop_description && crop.crop_description.toLowerCase().includes(query)) ||
        categoryName.includes(query) ||
        shopName.includes(query)
      );
    });
  
    setFilteredCrops(filtered);
  };
  
  return (
    <div style={{ padding: '50px' }}>
      <h1>Crop Viewing</h1>

      <input
        type="text"
        placeholder="Search crops, categories, or shops..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredCrops.length > 0 ? (
          filteredCrops.map(crop => (
            <div key={crop.crop_id} style={{ border: '1px solid black', padding: '20px', borderRadius: '8px', width: '300px' }}>
              <h2>{crop.crop_name}</h2>
              <p>{crop.crop_description}</p>
              <p><strong>Category:</strong> {categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name || 'N/A'}</p>
              <p><strong>Shop:</strong> {shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A'}</p>
              <p><strong>Price:</strong> ${crop.crop_price}</p>
              <p><strong>Rating:</strong> {crop.crop_rating}</p>
              <p><strong>Quantity:</strong> {crop.crop_quantity}</p>
              <p><strong>Weight:</strong> {crop.crop_weight}</p>
              <p><strong>Metric System:</strong> {crop.metric_system_id || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No crops found</p>
        )}
      </div>
    </div>
  );
}

export default SampleSearch;
