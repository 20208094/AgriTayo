import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropVarietyPageCRUD() {
  const [cropVarieties, setCropVarieties] = useState([]);
  const [formData, setFormData] = useState({
    crop_variety_id: '',
    crop_variety_name: '',
    crop_variety_description: '',
    crop_category_id: '',
    crop_sub_category_id: '',
    image: null, // Set up for image file handling
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [varietyToDelete, setVarietyToDelete] = useState(null);

  useEffect(() => {
    fetchCropVarieties();
    fetchCategories();
    fetchSubCategories();
  }, []);

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

  const fetchSubCategories = async () => {
    try {
      const response = await fetch('/api/crop_sub_categories', {
        headers: { 'x-api-key': API_KEY },
      });
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error('Error fetching crop sub-categories:', error);
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
    data.append('crop_variety_name', formData.crop_variety_name);
    data.append('crop_variety_description', formData.crop_variety_description);
    data.append('crop_category_id', formData.crop_category_id);
    data.append('crop_sub_category_id', formData.crop_sub_category_id);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch('/api/crop_varieties', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
        },
        body: data,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropVarieties();
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('crop_variety_name', formData.crop_variety_name);
    data.append('crop_variety_description', formData.crop_variety_description);
    data.append('crop_category_id', formData.crop_category_id);
    data.append('crop_sub_category_id', formData.crop_sub_category_id);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch(`/api/crop_varieties/${formData.crop_variety_id}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY,
        },
        body: data,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropVarieties();
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      crop_variety_id: '',
      crop_variety_name: '',
      crop_variety_description: '',
      crop_category_id: '',
      crop_sub_category_id: '',
      image: null,
    });
  };

  const handleEdit = (variety) => {
    setFormData(variety);
    setIsEditModalOpen(true);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    setVarietyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!varietyToDelete) return;

    try {
      const response = await fetch(`/api/crop_varieties/${varietyToDelete}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchCropVarieties();
    } catch (error) {
      console.error('Error deleting crop variety:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setVarietyToDelete(null);
    }
  };

  const filteredVarieties = cropVarieties.filter((variety) => {
    const matchesSearch = variety.crop_variety_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? variety.crop_category_id === parseInt(selectedCategory)
      : true;
    const matchesSubCategory = selectedSubCategory
      ? variety.crop_sub_category_id === parseInt(selectedSubCategory)
      : true;
    return matchesSearch && matchesCategory && matchesSubCategory;
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
    doc.text("Crop Variety List", xPosition + logoWidth / 2, textYPosition, { align: "center" });
    const tableStartY = textYPosition + marginBelowLogo + 5;

    const tableData = filteredVarieties.map(variety => [
      variety.crop_variety_id,
      variety.crop_variety_name,
      variety.crop_variety_description,
      categories.find(category => category.crop_category_id === variety.crop_category_id)?.crop_category_name || 'N/A',
      subCategories.find(subCategory => subCategory.crop_sub_category_id === variety.crop_sub_category_id)?.crop_sub_category_name || 'N/A',
      variety.crop_variety_image_url
    ]);

    doc.autoTable({
      startY: tableStartY,
      head: [['ID', 'Name', 'Description', 'Category', 'Sub-Category', 'Image URL']],
      body: tableData,
      headStyles: {
        fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
      },
    });
    doc.save('crop_varieties_list.pdf');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center text-[#00B251]">Crop Variety Management</h1>
      <div className="flex justify-between my-4">
        <input
          type="text"
          placeholder="Search Varieties"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded w-1/4"
        >
          <option value="">Filter by Category</option>
          {categories.map((category) => (
            <option key={category.crop_category_id} value={category.crop_category_id}>
              {category.crop_category_name}
            </option>
          ))}
        </select>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          className="p-2 border rounded w-1/4"
        >
          <option value="">Filter by Sub-Category</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.crop_sub_category_id} value={subCategory.crop_sub_category_id}>
              {subCategory.crop_sub_category_name}
            </option>
          ))}
        </select>
        <button
          onClick={exportToPDF}
          className="bg-[#00B251] text-white px-4 py-2 ml-4 rounded"
        >
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#00B251] text-white">
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVarieties.map((variety) => (
              <tr key={variety.crop_variety_id}>
                <td>{variety.crop_variety_id}</td>
                <td>{variety.crop_variety_name}</td>
                <td>{variety.crop_variety_description}</td>
                <td>
                  {categories.find(category => category.crop_category_id === variety.crop_category_id)?.crop_category_name}
                </td>
                <td>
                  {subCategories.find(subCategory => subCategory.crop_sub_category_id === variety.crop_sub_category_id)?.crop_sub_category_name}
                </td>
                <td>
                  {variety.crop_variety_image_url ? (
                    <img
                      src={variety.crop_variety_image_url}
                      alt={variety.crop_variety_name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(variety)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(variety.crop_variety_id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full sm:w-1/2">
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit' : 'Add'} Crop Variety</h2>
            <form onSubmit={isEdit ? handleEditSubmit : handleCreateSubmit}>
              <div className="mb-4">
                <label htmlFor="crop_variety_name" className="block font-semibold">Variety Name</label>
                <input
                  type="text"
                  id="crop_variety_name"
                  name="crop_variety_name"
                  value={formData.crop_variety_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="crop_variety_description" className="block font-semibold">Description</label>
                <textarea
                  id="crop_variety_description"
                  name="crop_variety_description"
                  value={formData.crop_variety_description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="crop_category_id" className="block font-semibold">Category</label>
                <select
                  name="crop_category_id"
                  value={formData.crop_category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
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
                <label htmlFor="crop_sub_category_id" className="block font-semibold">Sub-Category</label>
                <select
                  name="crop_sub_category_id"
                  value={formData.crop_sub_category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Sub-Category</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.crop_sub_category_id} value={subCategory.crop_sub_category_id}>
                      {subCategory.crop_sub_category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block font-semibold">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false) || setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00B251] text-white px-4 py-2 rounded"
                >
                  {isEdit ? 'Update Variety' : 'Add Variety'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this crop variety?</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropVarietyPageCRUD;
