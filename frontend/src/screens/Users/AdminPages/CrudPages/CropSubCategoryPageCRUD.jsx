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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center text-[#00B251]">Crop Subcategory Management</h1>
      <div className="flex flex-wrap gap-4 my-4">
        <button
          onClick={openAddModal}
          className="bg-[#00B251] text-white p-2 rounded"
        >
          + Subcategory
        </button>
      </div>
      <div className="flex flex-wrap gap-4 my-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/6"
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
          placeholder="Search Sub-Categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />

        <button onClick={exportToPDF} className="bg-[#00B251] text-white p-2 ml-4 rounded">
          Export to PDF
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead className="bg-[#00B251] text-white">
          <tr>
            {['ID', 'Name', 'Description', 'Category', 'Image URL', 'Actions'].map((header) => (
              <th key={header} className="p-2 text-center">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSubCategories.map((subCategory) => (
            <tr key={subCategory.crop_sub_category_id} className="text-center border-b hover:bg-gray-100">
              <td className="p-2">{subCategory.crop_sub_category_id}</td>
              
              <td className="p-2">{subCategory.crop_sub_category_name}</td>
              <td className="p-2">{subCategory.crop_sub_category_description}</td>
              <td className="p-2">
                {categories.find(category => category.crop_category_id === subCategory.crop_category_id)?.crop_category_name || 'N/A'}
              </td>
              <td className="p-2 border">
                {subCategory.crop_sub_category_image_url && (
                  <img
                    src={subCategory.crop_sub_category_image_url}
                    alt={subCategory.crop_sub_category_name}
                    className="w-20 h-auto mx-auto"
                  />
                )}
              </td>
              <td className="p-2">
                <button onClick={() => handleEdit(subCategory)} className="bg-[#00B251] text-white p-1 m-1 rounded">Edit</button>
                <button onClick={() => handleDelete(subCategory.crop_sub_category_id)} className="bg-red-500 text-white p-1 m-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Sub-Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-[#00B251] font-semibold">Add Crop Subcategory</h2>
            <form onSubmit={handleCreateSubmit} encType="multipart/form-data">
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
              <p className="text-l font-bold mb-4" style={{ marginBottom: '5px' }}>Description</p>
                <textarea
                  name="crop_sub_category_description"
                  value={formData.crop_sub_category_description}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
              <p className="text-l font-bold mb-4" style={{ marginBottom: '5px' }}>Image</p>
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#00B251] text-white px-4 py-2 rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-[#00B251]">Edit Subcategory</h2>
            <form onSubmit={handleEditSubmit} encType="multipart/form-data">
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
              <p className="text-l font-bold mb-4" style={{marginBottom: '5px' }}>Category</p>
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#00B251] text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this sub-category?</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CropSubCategoryPageCRUD;
