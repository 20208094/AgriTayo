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
    crop_price: '',
    crop_quantity: '',
    metric_system_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [varieties, setCropVarieties] = useState([]);
  const [shops, setShops] = useState([]);
  const [metricSystems, setMetricSystems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedMetricSystem, setSelectedMetricSystem] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);

  useEffect(() => {
    fetchCrops();
    fetchCategories();
    fetchSubcategories();
    fetchCropVarieties();
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

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/crop_sub_categories', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching crop subcategories:', error);
    }
  };

  const fetchCropVarieties = async () => {
    try {
      const response = await fetch('/api/crop_varieties', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setCropVarieties(data);
    } catch (error) {
      console.error('Error fetching crop varieties:', error);
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
      crop_price: '',
      crop_quantity: '',
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

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.crop_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.crop_price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (subcategories.find(subcategory => subcategory.crop_sub_category_id === crop.sub_category_id)?.crop_sub_category_name.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id)?.crop_variety_name.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesCategory = selectedCategory
      ? crop.category_id === parseInt(selectedCategory)
      : true;
    const matchesSubcategory = selectedSubcategory
      ? crop.sub_category_id === parseInt(selectedSubcategory)
      : true;
    const matchesVariety = selectedVariety
      ? crop.crop_variety_id === parseInt(selectedVariety)
      : true;
    const matchesShop = selectedShop ? crop.shop_id === parseInt(selectedShop) : true;
    const matchesMetricSystem = selectedMetricSystem
      ? crop.metric_system_id === parseInt(selectedMetricSystem)
      : true;
    return matchesSearch && matchesCategory && matchesSubcategory && matchesVariety && matchesShop && matchesMetricSystem;
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
      subcategories.find(subcategory => subcategory.crop_subcategory_id === crop.subcategory_id)?.crop_subcategory_name || 'N/A',
      varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id)?.crop_variety_name || 'N/A',
      shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A',
      crop.crop_image,
      crop.crop_price,
      crop.crop_quantity,
      metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name || 'N/A',
    ]);

    doc.autoTable({
      startY: tableStartY,
      head: [['ID', 'Name', 'Description', 'Category', 'Shop', 'Image', 'Price', 'Quantity', 'Weight', 'Metric System']],
      body: tableData,
      headStyles: {
        fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
      },
    });
    doc.save('crops_list.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                Crops Management
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Manage and organize crop information
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <span className="text-gray-800 font-medium">
                  {filteredCrops.length} Crops
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              + Add Crop
            </button>

            <button
              onClick={exportToPDF}
              className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.crop_category_id} value={category.crop_category_id}>
                  {category.crop_category_name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            >
              <option value="">All Subcategories</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.crop_sub_category_id} value={subcategory.crop_sub_category_id}>
                  {subcategory.crop_sub_category_name}
                </option>
              ))}
            </select>

            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            >
              <option value="">All Varieties</option>
              {varieties.map(variety => (
                <option key={variety.crop_variety_id} value={variety.crop_variety_id}>
                  {variety.crop_variety_name}
                </option>
              ))}
            </select>

            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            >
              <option value="">All Shops</option>
              {shops.map(shop => (
                <option key={shop.shop_id} value={shop.shop_id}>
                  {shop.shop_name}
                </option>
              ))}
            </select>

            <select
              value={selectedMetricSystem}
              onChange={(e) => setSelectedMetricSystem(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            >
              <option value="">All Metric Systems</option>
              {metricSystems.map(metric => (
                <option key={metric.metric_system_id} value={metric.metric_system_id}>
                  {metric.metric_system_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search Crops"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-x-auto w-full">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="w-20 px-6 py-4 text-center">ID</th>
                <th className="w-40 px-6 py-4 text-center">Name</th>
                <th className="w-64 px-6 py-4 text-center">Description</th>
                <th className="w-40 px-6 py-4 text-center">Category</th>
                <th className="w-40 px-6 py-4 text-center">Subcategory</th>
                <th className="w-40 px-6 py-4 text-center">Variety</th>
                <th className="w-40 px-6 py-4 text-center">Shop</th>
                <th className="w-32 px-6 py-4 text-center">Price</th>
                <th className="w-32 px-6 py-4 text-center">Quantity</th>
                <th className="w-40 px-6 py-4 text-center">Metric System</th>
                <th className="w-40 px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCrops.map((crop) => (
                <tr key={crop.crop_id} className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-center">{crop.crop_id}</td>
                  <td className="px-6 py-4 text-center font-medium">{crop.crop_name}</td>
                  <td className="px-6 py-4 text-center whitespace-normal">{crop.crop_description}</td>
                  <td className="px-6 py-4 text-center">
                    {categories.find(category => category.crop_category_id === crop.category_id)?.crop_category_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {subcategories.find(subcategory => subcategory.crop_sub_category_id === crop.sub_category_id)?.crop_sub_category_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id)?.crop_variety_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {shops.find(shop => shop.shop_id === crop.shop_id)?.shop_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">₱{crop.crop_price}</td>
                  <td className="px-6 py-4 text-center">{crop.crop_quantity}</td>
                  <td className="px-6 py-4 text-center">
                    {metricSystems.find(metric => metric.metric_system_id === crop.metric_system_id)?.metric_system_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(crop)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                          transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(crop.crop_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600
                          transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEditModalOpen ? 'Edit Crop' : 'Add Crop'}
                </h2>
                <form onSubmit={isEditModalOpen ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Crop Name</p>
                  <input
                    type="text"
                    name="crop_name"
                    value={formData.crop_name}
                    onChange={handleInputChange}
                    placeholder="Crop Name"
                    required
                    className="p-2 border rounded mb-2 w-full"
                  />

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Crop Description</p>
                  <input
                    type="text"
                    name="crop_description"
                    value={formData.crop_description}
                    onChange={handleInputChange}
                    placeholder="Crop Description"
                    className="p-2 border rounded mb-2 w-full"
                  />

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Crop Category</p>
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

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Subcategory</p>
                  <select
                    name="sub_category_id"
                    value={formData.crop_sub_category_id}
                    onChange={handleInputChange}
                    required
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory.crop_sub_category_id} value={subcategory.crop_sub_category_id}>
                        {subcategory.crop_sub_category_name}
                      </option>
                    ))}
                  </select>

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Variety</p>
                  <select
                    name="variety_id"
                    value={formData.crop_variety_id}
                    onChange={handleInputChange}
                    required
                    className="p-2 border rounded mb-2 w-full"
                  >
                    <option value="">Select Variety</option>
                    {varieties.map(variety => (
                      <option key={variety.crop_variety_id} value={variety.crop_variety_id}>
                        {variety.crop_variety_name}
                      </option>
                    ))}
                  </select>

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Shop</p>
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
                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Crop Image</p>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required={!isEdit}
                    className="p-2 border rounded mb-2 w-full"
                  />
                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Price</p>
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
                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Quantity</p>
                  <input
                    type="number"
                    name="crop_quantity"
                    value={formData.crop_quantity}
                    onChange={handleInputChange}
                    placeholder="Crop Quantity"
                    className="p-2 border rounded mb-2 w-full"
                  />

                  <p className="text-l font-bold mb-4" style={{ marginBottom: '-15px' }}>Metric System</p>
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
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                        transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700
                        transition-colors duration-200"
                    >
                      {isEditModalOpen ? 'Save' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this crop?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                    transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600
                    transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropsPage;
