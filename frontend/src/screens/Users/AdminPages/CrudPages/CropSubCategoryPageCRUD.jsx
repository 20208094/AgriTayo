import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropSubCategoryPageCRUD() {
  const [cropSubCategories, setCropSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    crop_sub_category_id: '',
    crop_sub_category_name: '',
    crop_sub_category_description: '',
    crop_category_id: '',
    image: null, // Set up for image file handling
  });
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCropSubCategories();
    fetchCategories();
  }, []);

  const fetchCropSubCategories = async () => {
    try {
      const response = await fetch('/api/crop_sub_categories', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setCropSubCategories(data);
    } catch (error) {
      console.error('Error fetching crop sub-categories:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('crop_sub_category_name', formData.crop_sub_category_name);
    data.append('crop_sub_category_description', formData.crop_sub_category_description);
    data.append('crop_category_id', formData.crop_category_id);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch('/api/crop_sub_categories', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
        },
        body: data,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropSubCategories();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('crop_sub_category_name', formData.crop_sub_category_name);
    data.append('crop_sub_category_description', formData.crop_sub_category_description);
    data.append('crop_category_id', formData.crop_category_id);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch(`/api/crop_sub_categories/${formData.crop_sub_category_id}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY,
        },
        body: data,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropSubCategories();
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      crop_sub_category_id: '',
      crop_sub_category_name: '',
      crop_sub_category_description: '',
      crop_category_id: '',
      image: null,
    });
  };

  const handleEdit = (subCategory) => {
    setFormData(subCategory);
    setIsEditModalOpen(true);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    setSubCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!subCategoryToDelete) return;

    try {
      const response = await fetch(`/api/crop_sub_categories/${subCategoryToDelete}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropSubCategories();
    } catch (error) {
      console.error('Error deleting crop sub-category:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setSubCategoryToDelete(null);
    }
  };

  const filteredSubCategories = cropSubCategories.filter((subCategory) => {
    const matchesSearch = subCategory.crop_sub_category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? subCategory.crop_category_id === parseInt(selectedCategory)
      : true;
    return matchesSearch && matchesCategory;
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
    doc.text("Crop Sub-Category List", xPosition + logoWidth / 2, textYPosition, { align: "center" });
    const tableStartY = textYPosition + marginBelowLogo + 5;

    const tableData = filteredSubCategories.map(subCategory => [
      subCategory.crop_sub_category_id,
      subCategory.crop_sub_category_name,
      subCategory.crop_sub_category_description,
      categories.find(category => category.crop_category_id === subCategory.crop_category_id)?.crop_category_name || 'N/A',
      subCategory.crop_sub_category_image_url
    ]);

    doc.autoTable({
      startY: tableStartY,
      head: [['ID', 'Name', 'Description', 'Category', 'Image URL']],
      body: tableData,
      headStyles: {
        fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
      },
    });
    doc.save('crop_sub_categories_list.pdf');
  };

  const openAddModal = () => {
    resetForm(); // Reset form fields
    setIsEdit(false); // Ensure it's in create mode
    setIsAddModalOpen(true); // Open the modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                        Product Subcategories
                    </h1>
                    <p className="text-white/80 text-lg font-medium">
                        Browse through our selection of product varieties
                    </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                        <span className="text-white font-medium">
                            {filteredSubCategories.length} Categories
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={openAddModal}
            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
              hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            + Add Subcategory
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.crop_category_id} value={category.crop_category_id}>
                  {category.crop_category_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-96
                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
            />

            <button
              onClick={exportToPDF}
              className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Export to PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                {['ID', 'Name', 'Description', 'Category', 'Image', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubCategories.map((subCategory) => (
                <tr key={subCategory.crop_sub_category_id} 
                  className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-6 py-4">{subCategory.crop_sub_category_id}</td>
                  <td className="px-6 py-4 font-medium">{subCategory.crop_sub_category_name}</td>
                  <td className="px-6 py-4">{subCategory.crop_sub_category_description}</td>
                  <td className="px-6 py-4">
                    {categories.find(category => 
                      category.crop_category_id === subCategory.crop_category_id
                    )?.crop_category_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {subCategory.crop_sub_category_image_url && (
                      <img
                        src={subCategory.crop_sub_category_image_url}
                        alt={subCategory.crop_sub_category_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(subCategory)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                          transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subCategory.crop_sub_category_id)}
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEditModalOpen ? 'Edit Subcategory' : 'Add Subcategory'}
                </h2>
                <form onSubmit={isEditModalOpen ? handleEditSubmit : handleCreateSubmit} 
                  className="space-y-4">
                  <div className="mb-4">
                    <p className="text-l font-bold mb-4" style={{ marginTop: '20px',marginBottom: '5px' }}>Subcategory Name</p>
                    <input
                      type="text"
                      name="crop_sub_category_name"
                      value={formData.crop_sub_category_name}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-l font-bold mb-4" style={{marginBottom: '5px' }}>Description</p>
                    <textarea
                      name="crop_sub_category_description"
                      value={formData.crop_sub_category_description}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-l font-bold mb-4" style={{marginBottom: '5px' }}>Image</p>
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className="p-2 border rounded w-full"
                      accept="image/*"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-l font-bold mb-4" style={{ marginBottom: '5px' }}>Category</p>
                    <select
                      name="crop_category_id"
                      value={formData.crop_category_id}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.crop_category_id} value={category.crop_category_id}>
                          {category.crop_category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
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
              <p className="text-gray-600 mb-6">Are you sure you want to delete this subcategory?</p>
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

export default CropSubCategoryPageCRUD;
