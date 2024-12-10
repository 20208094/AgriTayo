import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function CropCategoryPageCRUD() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    crop_category_id: '',
    crop_category_name: '',
    crop_category_description: '',
    image: null
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/crop_categories/${formData.crop_category_id}` : '/api/crop_categories';
    const method = isEdit ? 'PUT' : 'POST';

    const formPayload = new FormData();
    formPayload.append('crop_category_name', formData.crop_category_name);
    formPayload.append('crop_category_description', formData.crop_category_description);
    if (formData.image) {
      formPayload.append('image', formData.image);
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'x-api-key': API_KEY,
        },
        body: formPayload
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCategories();
      setFormData({
        crop_category_id: '',
        crop_category_name: '',
        crop_category_description: '',
        image: null
      });
      setIsEdit(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      crop_category_id: category.crop_category_id,
      crop_category_name: category.crop_category_name,
      crop_category_description: category.crop_category_description,
      image: null
    });
    setIsEdit(true);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/crop_categories/${selectedCategoryId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCategories();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting crop category:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter((category) =>
    category.crop_category_name.toLowerCase().includes(searchQuery) ||
    category.crop_category_description.toLowerCase().includes(searchQuery)
  );

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
    doc.text("Crop Categories List", xPosition + logoWidth / 2, textYPosition, { align: "center" });

    const tableStartY = textYPosition + marginBelowLogo + 5;
    const tableData = filteredCategories.map(category => [
      category.crop_category_id,
      category.crop_category_name,
      category.crop_category_description
    ]);
    doc.autoTable({
      startY: tableStartY,
      head: [['ID', 'Category Name', 'Description']],
      body: tableData,
      headStyles: {
        fillColor: [0, 128, 0], halign: 'center', valign: 'middle'
      },
    });
    doc.save('crop_categories_list.pdf');
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setFormData({
      metric_system_name: '',
      metric_val_kilogram: '',
      metric_val_gram: '',
      metric_val_pounds: '',
    });
    setIsEdit(false);
  };

  const onSubmit = (event) => {
    handleSubmit(event);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                Crop Categories Management
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Manage and organize crop categories
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <span className="text-gray-800 font-medium">
                  {filteredCategories.length} Categories
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={toggleModal}
            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
              hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            + Add Category
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={handleSearchChange}
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
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Category Name</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-center">Image</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.crop_category_id} className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-6 py-4">{category.crop_category_id}</td>
                  <td className="px-6 py-4 font-medium">{category.crop_category_name}</td>
                  <td className="px-6 py-4">{category.crop_category_description}</td>
                  <td className="px-6 py-4 text-center">
                    {category.crop_category_image_url && (
                      <img
                        src={category.crop_category_image_url}
                        alt={category.crop_category_name}
                        className="w-20 h-20 object-cover rounded-lg mx-auto"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                          transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategoryId(category.crop_category_id);
                          setShowDeleteModal(true);
                        }}
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

        {/* Create/Edit Modal */}
        {(isModalOpen || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEdit ? 'Edit Category' : 'Add Category'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-4">
                  <input type="hidden" name="crop_category_id" value={formData.crop_category_id} />
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Category Name</p>
                    <input
                      type="text"
                      name="crop_category_name"
                      value={formData.crop_category_name}
                      onChange={handleInputChange}
                      placeholder="Crop Category Name"
                      required
                      className="border p-2 w-full rounded-md"
                    />
                    <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Category Description</p>
                    <input
                      type="text"
                      name="crop_category_description"
                      value={formData.crop_category_description}
                      onChange={handleInputChange}
                      placeholder="Crop Category Description"
                      className="border p-2 w-full rounded-md"
                    />
                    <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Image</p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border p-2 w-full rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        setShowEditModal(false);
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
                      {isEdit ? 'Save' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this category?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                    transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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

export default CropCategoryPageCRUD;
