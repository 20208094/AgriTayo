import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function CropsPage() {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    crop_id: '',
    crop_name: '',
    crop_description: '',
    category_id: '',
    shop_id: '',
    image: null,
    crop_rating: '',
    crop_price: '',
    crop_quantity: '',
    crop_weight: '',
    metric_system_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [metricSystems, setMetricSystems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCrops();
    fetchCategories();
    fetchShops();
    fetchMetricSystems();
  }, []);

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

  const fetchMetricSystems = async () => {
    try {
      const response = await fetch('/api/metric_systems', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMetricSystems(data);
    } catch (error) {
      console.error('Error fetching metric systems:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/crops/${formData.crop_id}` : '/api/crops';
    const method = isEdit ? 'PUT' : 'POST';

    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'x-api-key': API_KEY,
        },
        body: dataToSend
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCrops();
      resetForm();
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      crop_id: '',
      crop_name: '',
      crop_description: '',
      category_id: '',
      shop_id: '',
      image: null,
      crop_rating: '',
      crop_price: '',
      crop_quantity: '',
      crop_weight: '',
      metric_system_id: ''
    });
  };

  const handleEdit = (crop) => {
    setFormData(crop);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/crops/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const filteredCrops = crops.filter(crop => 
    crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.crop_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //pdf table design
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Crops List', 14, 16);
    const tableData = filteredCrops.map(crop => [
      crop.crop_id,
      crop.crop_name,
      crop.crop_description,
      categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name || 'N/A',
      shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A',
      crop.crop_image,
      crop.crop_rating,
      crop.crop_price,
      crop.crop_quantity,
      crop.crop_weight,
      metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name || 'N/A',
    ]);
    doc.autoTable({
      head: [['ID', 'Name', 'Description', 'Category', 'Shop', 'Image', 'Rating', 'Price', 'Quantity', 'Weight', 'Metric System']],
      body: tableData,
    });
    doc.save('crops_list.pdf');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Crops Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="crop_name"
          value={formData.crop_name}
          onChange={handleInputChange}
          placeholder="Crop Name"
          required
        />
        <input
          type="text"
          name="crop_description"
          value={formData.crop_description}
          onChange={handleInputChange}
          placeholder="Crop Description"
        />
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.crop_category_id} value={category.crop_category_id}>
              {category.crop_category_name}
            </option>
          ))}
        </select>
        <select
          name="shop_id"
          value={formData.shop_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Shop</option>
          {shops.map((shop) => (
            <option key={shop.shop_id} value={shop.shop_id}>
              {shop.shop_name}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
          required
        />
        <input
          type="number"
          step="0.01"
          name="crop_rating"
          value={formData.crop_rating}
          onChange={handleInputChange}
          placeholder="Crop Rating"
        />
        <input
          type="number"
          step="0.01"
          name="crop_price"
          value={formData.crop_price}
          onChange={handleInputChange}
          placeholder="Crop Price"
          required
        />
        <input
          type="number"
          name="crop_quantity"
          value={formData.crop_quantity}
          onChange={handleInputChange}
          placeholder="Crop Quantity"
        />
        <input
          type="number"
          step="0.0001"
          name="crop_weight"
          value={formData.crop_weight}
          onChange={handleInputChange}
          placeholder="Crop Weight"
        />
        <select
          name="metric_system_id"
          value={formData.metric_system_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Metric System</option>
          {metricSystems.map((metric) => (
            <option key={metric.metric_system_id} value={metric.metric_system_id}>
              {metric.metric_system_name}
            </option>
          ))}
        </select>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Crops"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '20px 0', padding: '5px' }}
        />
        <button onClick={exportToPDF} style={{ marginBottom: '20px' }}>Export to PDF</button>
      </div>
      
      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Shop</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Image</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Rating</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Weight</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Metric System</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCrops.map((crop) => (
            <tr key={crop.crop_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name || 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_image}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_rating}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_price}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_quantity}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{crop.crop_weight}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name || 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(crop)}>Edit</button>
                <button onClick={() => handleDelete(crop.crop_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CropsPage;
