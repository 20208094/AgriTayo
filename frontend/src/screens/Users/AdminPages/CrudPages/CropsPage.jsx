import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedRatingRange, setSelectedRatingRange] = useState('');
  const [selectedMetricSystem, setSelectedMetricSystem] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);

  useEffect(() => {
    fetchCrops();
    fetchCategories();
    fetchShops();
    fetchMetricSystems();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('/api/crops', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/crop_categories', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching crop categories:', error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchMetricSystems = async () => {
    try {
      const response = await fetch('/api/metric_systems', {
        headers: { 'x-api-key': API_KEY },
      });
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/crops';
    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY },
        body: dataToSend
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCrops();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const url = `/api/crops/${formData.crop_id}`;
    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'x-api-key': API_KEY },
        body: dataToSend
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCrops();
      resetForm();
      setIsEditModalOpen(false);
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
    setIsEditModalOpen(true);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    setCropToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!cropToDelete) return;

    try {
      const response = await fetch(`/api/crops/${cropToDelete}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setCropToDelete(null);
    }
  };

  const getRatingRange = (rating) => {
    if (rating >= 0 && rating <= 1) return '0-1';
    if (rating >= 2 && rating <= 3) return '2-3';
    if (rating >= 4 && rating <= 5) return '4-5';
    if (rating >= 6 && rating <= 7) return '6-7';
    if (rating >= 8 && rating <= 9) return '8-9';
    return '';
  };

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? crop.category_id === parseInt(selectedCategory)
      : true;
    const matchesShop = selectedShop ? crop.shop_id === parseInt(selectedShop) : true;
    const matchesRating = selectedRatingRange
      ? (() => {
        const [min, max] = selectedRatingRange.split('-').map(Number);
        return crop.crop_rating >= min && crop.crop_rating <= max;
      })()
      : true;
    const matchesMetricSystem = selectedMetricSystem
      ? crop.metric_system_id === parseInt(selectedMetricSystem)
      : true;
    return matchesSearch && matchesCategory && matchesShop && matchesRating && matchesMetricSystem;
  });


  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const logoWidth = 50;
    const logoHeight = 50;
    const marginBelowLogo = 5;
    const textMargin = 5;

    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - logoWidth) / 2;
    doc.addImage(MainLogo, 'PNG', xPosition, 10, logoWidth, logoHeight);
    const textYPosition = 10 + logoHeight + textMargin;
    doc.text("Crop List", xPosition + logoWidth / 2, textYPosition, { align: "center" });
    const tableStartY = textYPosition + marginBelowLogo + 5;

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
      startY: tableStartY,
      head: [['ID', 'Name', 'Description', 'Category', 'Shop', 'Image', 'Rating', 'Price', 'Quantity', 'Weight', 'Metric System']],
      body: tableData,
      headStyles: {
        fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
      },
    });
    doc.save('crops_list.pdf');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center text-[#00B251]">Crops Management</h1>
      <div className="flex justify-between my-4">
        <input
          type="text"
          placeholder="Search Crops"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00B251] text-white p-2 ml-4 rounded"
        >
          Add Crop
        </button>
        <button onClick={exportToPDF} className="bg-[#00B251] text-white p-2 ml-4 rounded">
          Export to PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 my-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.crop_category_id} value={category.crop_category_id}>
              {category.crop_category_name}
            </option>
          ))}
        </select>

        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/4"
        >
          <option value="">All Shops</option>
          {shops.map(shop => (
            <option key={shop.shop_id} value={shop.shop_id}>
              {shop.shop_name}
            </option>
          ))}
        </select>

        <select
          value={selectedRatingRange}
          onChange={(e) => setSelectedRatingRange(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/4"
        >
          <option value="">All Ratings</option>
          <option value="0-1">0 - 1</option>
          <option value="2-3">2 - 3</option>
          <option value="4-5">4 - 5</option>
          <option value="6-7">6 - 7</option>
          <option value="8-9">8 - 9</option>
        </select>

        <select
          value={selectedMetricSystem}
          onChange={(e) => setSelectedMetricSystem(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/4"
        >
          <option value="">All Metric Systems</option>
          {metricSystems.map(metric => (
            <option key={metric.metric_system_id} value={metric.metric_system_id}>
              {metric.metric_system_name}
            </option>
          ))}
        </select>
      </div>

      {/* Crops Table */}
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead className="bg-[#00B251] text-white">
          <tr>
            {['ID', 'Name', 'Description', 'Category', 'Shop', 'Image', 'Rating', 'Price', 'Quantity', 'Weight', 'Metric System', 'Actions'].map((header) => (
              <th key={header} className="p-2 text-center">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCrops.map((crop) => (
            <tr key={crop.crop_id} className="text-center border-b hover:bg-gray-100">
              <td className="p-2">{crop.crop_id}</td>
              <td className="p-2">{crop.crop_name}</td>
              <td className="p-2">{crop.crop_description}</td>
              <td className="p-2">
                {categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name || 'N/A'}
              </td>
              <td className="p-2">
                {shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A'}
              </td>
              <td className="p-2">{crop.crop_image}</td>
              <td className="p-2">{crop.crop_rating}</td>
              <td className="p-2">{crop.crop_price}</td>
              <td className="p-2">{crop.crop_quantity}</td>
              <td className="p-2">{crop.crop_weight}</td>
              <td className="p-2">
                {metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name || 'N/A'}
              </td>
              <td className="p-2 flex justify-center gap-2">
                <button onClick={() => handleEdit(crop)} className="bg-[#00B251] text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(crop.crop_id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding/Editing */}
      {isAddModalOpen || isEditModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-11/12 sm:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-[#00B251]">{isEdit ? 'Edit Crop' : 'Add Crop'}</h2>
            <form onSubmit={isEdit ? handleEditSubmit : handleCreateSubmit}>
              <input
                type="text"
                name="crop_name"
                value={formData.crop_name}
                onChange={handleInputChange}
                placeholder="Crop Name"
                required
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="text"
                name="crop_description"
                value={formData.crop_description}
                onChange={handleInputChange}
                placeholder="Crop Description"
                className="p-2 border rounded mb-2 w-full"
              />
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                className="p-2 border rounded mb-2 w-full"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
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
                className="p-2 border rounded mb-2 w-full"
              >
                <option value="">Select Shop</option>
                {shops.map(shop => (
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
                required={!isEdit}
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="number"
                step="0.01"
                name="crop_rating"
                value={formData.crop_rating}
                onChange={handleInputChange}
                placeholder="Crop Rating"
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="number"
                step="0.01"
                name="crop_price"
                value={formData.crop_price}
                onChange={handleInputChange}
                placeholder="Crop Price"
                required
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="number"
                name="crop_quantity"
                value={formData.crop_quantity}
                onChange={handleInputChange}
                placeholder="Crop Quantity"
                className="p-2 border rounded mb-2 w-full"
              />
              <input
                type="number"
                step="0.0001"
                name="crop_weight"
                value={formData.crop_weight}
                onChange={handleInputChange}
                placeholder="Crop Weight"
                className="p-2 border rounded mb-2 w-full"
              />
              <select
                name="metric_system_id"
                value={formData.metric_system_id}
                onChange={handleInputChange}
                required
                className="p-2 border rounded mb-4 w-full"
              >
                <option value="">Select Metric System</option>
                {metricSystems.map(metric => (
                  <option key={metric.metric_system_id} value={metric.metric_system_id}>
                    {metric.metric_system_name}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsEditModalOpen(false); setIsAddModalOpen(false); }}
                  className="bg-gray-400 text-white p-2 rounded w-full mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00B251] text-white p-2 rounded w-full"
                >
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-1/2 sm:w-1/3">
            <h2 className="text-xl font-bold text-center text-red-500 mb-4">Delete Crop</h2>
            <p className="text-center mb-4">Are you sure you want to delete this crop?</p>
            <div className="flex justify-between">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white p-2 rounded w-full mr-2">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-500 text-white p-2 rounded w-full">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropsPage;
