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
      setIsEdit(false);
      setShowEditModal(false);
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
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user type:', error);
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEdit(true);
    setShowEditModal(true);
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">User Type Table</h1>

      <form onSubmit={isEdit ? handleUpdate : handleCreate} className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          name="user_type_id"
          value={formData.user_type_id || ''}
          onChange={handleInputChange}
          className="form-control border border-gray-300 rounded p-2 w-full md:w-32"
          placeholder="ID"
          required
          disabled={isEdit}
        />
        <input
          type="text"
          name="user_type_name"
          value={formData.user_type_name || ''}
          onChange={handleInputChange}
          className="form-control border border-gray-300 rounded p-2 w-full md:w-64"
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="user_type_description"
          value={formData.user_type_description || ''}
          onChange={handleInputChange}
          className="form-control border border-gray-300 rounded p-2 w-full md:w-96"
          placeholder="Description"
          required
        />
        <button
          type="button"
          className="bg-[#00B251] text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowEditModal(true)}
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for user type"
          className="border border-gray-300 rounded p-2 w-full md:w-96"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-[#00B251] text-white">
            <tr>
              <th className="border border-gray-200 p-4 text-left">ID</th>
              <th className="border border-gray-200 p-4 text-left">Name</th>
              <th className="border border-gray-200 p-4 text-left">Description</th>
              <th className="border border-gray-200 p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserTypes.map((type) => (
              <tr key={type.user_type_id} className="hover:bg-gray-100">
                <td className="border border-gray-200 p-4">{type.user_type_id}</td>
                <td className="border border-gray-200 p-4">{type.user_type_name}</td>
                <td className="border border-gray-200 p-4">{type.user_type_description}</td>
                <td className="border border-gray-200 p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(type)}
                    className="bg-[#00B251] text-white font-semibold py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDeleteId(type.user_type_id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white font-semibold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit User Type' : 'Create User Type'}</h2>
            <form onSubmit={isEdit ? handleUpdate : handleCreate}>
              <input
                type="text"
                name="user_type_name"
                value={formData.user_type_name || ''}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full mb-4"
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="user_type_description"
                value={formData.user_type_description || ''}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full mb-4"
                placeholder="Description"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00B251] text-white py-2 px-4 rounded"
                >
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user type?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#00B251] text-white py-2 px-4 rounded"
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

export default UserTypePage;
