import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function UserTypePage() {
  const [userTypes, setUserTypes] = useState([]);
  const [filteredUserTypes, setFilteredUserTypes] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/user_types', {
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setUserTypes(data);
      setFilteredUserTypes(data);
    } catch (error) {
      console.error('Error fetching user types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filtered = userTypes.filter(
      (type) =>
        type.user_type_name.toLowerCase().includes(value.toLowerCase()) ||
        type.user_type_description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUserTypes(filtered);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user_types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchData();
      setFormData({});
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating user type:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/user_types/${formData.user_type_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchData();
      setFormData({});
      setIsEdit(false);
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating user type:', error);
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user_types/${selectedDeleteId}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchData();
      setShowDeleteModal(false);
      setSelectedDeleteId(null);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const toggleModal = (isEditMode = false) => {
    setModalOpen(!isModalOpen);
    setIsEdit(isEditMode);
    if (!isEditMode) {
      setFormData({
        user_type_id: '',
        user_type_name: '',
        user_type_description: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                        User Type Management
                    </h1>
                    <p className="text-white/80 text-lg font-medium">
                        Manage and organize user roles and permissions
                    </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                        <span className="text-white font-medium">
                            {filteredUserTypes.length} User Types
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={() => toggleModal(false)}
            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
              hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            + Add User Type
          </button>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search user types..."
            className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-96
              focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUserTypes.map((type) => (
                  <tr key={type.user_type_id} className="hover:bg-white/50 transition-colors duration-150">
                    <td className="px-6 py-4">{type.user_type_id}</td>
                    <td className="px-6 py-4 font-medium">{type.user_type_name}</td>
                    <td className="px-6 py-4">{type.user_type_description}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                            transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDeleteId(type.user_type_id);
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
        </div>

        {/* Improved Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 scale-100">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit User Type' : 'Add New User Type'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={isEdit ? handleUpdate : handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Type Name</label>
                    <input
                      type="text"
                      name="user_type_name"
                      value={formData.user_type_name || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      required
                      placeholder="Enter user type name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="user_type_description"
                      value={formData.user_type_description || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      required
                      rows="3"
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                        transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700
                        transition-colors duration-200 font-medium"
                    >
                      {isEdit ? 'Save Changes' : 'Create User Type'}
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
              <p className="text-gray-600 mb-6">Are you sure you want to delete this user type?</p>
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

export default UserTypePage;
