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
    setFormData({ metric_system_name: '',
      metric_val_kilogram: '',
      metric_val_gram: '',
      metric_val_pounds: '', }); 
    setIsEdit(false);
  };

  const onSubmit = (event) => {
    handleSubmit(event);  
    setModalOpen(false);  
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Crop Categories Management</h1>

      <button onClick={toggleModal} className="bg-[#00B251] text-white py-2 px-4 rounded-md">
        + Crop Category
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-[#00B251] font-semibold">Add Crop Category</h2>
            {/* Form */}
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
              <div className="flex justify-end mt-4 space-x-1">
                <button
                  onClick={toggleModal}
                  className="bg-gray-400 text-white p-2 rounded-md mt-4"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#00B251] text-white py-2 px-4 rounded-md mt-4">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center mt-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 rounded-md w-1/2"
        />
        <button onClick={exportToPDF} className="bg-[#00B251] text-white py-2 px-4 rounded-md ml-4">Export to PDF</button>
      </div>

      <table className="min-w-full mt-8 border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-[#00B251] text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Category Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.crop_category_id} className="text-center">
              <td className="p-2 border">{category.crop_category_id}</td>
              <td className="p-2 border">{category.crop_category_name}</td>
              <td className="p-2 border">{category.crop_category_description}</td>
              <td className="p-2 border">
                {category.crop_category_image_url && (
                  <img
                    src={category.crop_category_image_url}
                    alt={category.crop_category_name}
                    className="w-20 h-auto mx-auto"
                  />
                )}
              </td>
              <td className="p-2 border">
                <button onClick={() => handleEdit(category)} className="bg-[#00B251] text-white py-1 px-3 rounded-md mx-1">Edit</button>
                <button onClick={() => { setSelectedCategoryId(category.crop_category_id); setShowDeleteModal(true); }} className="bg-red-500 text-white py-1 px-3 rounded-md mx-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="crop_category_id" value={formData.crop_category_id} />
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
              <div className="flex justify-end mt-4 space-x-1">
              <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white p-2 rounded-md mt-4">Cancel</button>
              <button type="submit" className="bg-[#00B251] text-white py-2 px-4 rounded-md mt-4">Save</button>
              </div>
            </form>
           
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end mt-6">
              <button onClick={handleDelete} className="bg-[#00B251] text-white py-2 px-4 rounded-md mr-2">Confirm</button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropCategoryPageCRUD;
