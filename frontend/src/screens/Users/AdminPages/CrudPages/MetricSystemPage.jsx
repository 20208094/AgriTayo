import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function MetricSystemPage() {
  const [metricSystems, setMetricSystems] = useState([]);
  const [filteredMetricSystems, setFilteredMetricSystems] = useState([]);
  const [formData, setFormData] = useState({
    metric_system_name: '',
    metric_val_kilogram: '',
    metric_val_gram: '',
    metric_val_pounds: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState(null);

  useEffect(() => {
    fetchMetricSystems();
  }, []);

  const fetchMetricSystems = async () => {
    try {
      const response = await fetch('/api/metric_systems', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMetricSystems(data);
      setFilteredMetricSystems(data);
    } catch (error) {
      console.error('Error fetching metric systems:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = metricSystems.filter(
      (metric) =>
        metric.metric_system_name.toLowerCase().includes(value.toLowerCase()) ||
        metric.metric_val_kilogram.toString().includes(value) ||
        metric.metric_val_gram.toString().includes(value) ||
        metric.metric_val_pounds.toString().includes(value)
    );
    setFilteredMetricSystems(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/metric_systems/${formData.metric_system_id}` : '/api/metric_systems';
    const method = isEdit ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
      
      // Fetch updated metric systems
      fetchMetricSystems();
  
      // Reset the form data after successful submission
      setFormData({
        metric_system_name: '',
        metric_val_kilogram: '',
        metric_val_gram: '',
        metric_val_pounds: '',
      });
  
      // Reset editing state
      setIsEdit(false);
  
      // Close the modal
      setShowEditModal(false);
      closeModal();  // Close the modal here after submission
  
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  const handleEdit = (metric) => {
    setFormData(metric);
    setIsEdit(true);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/metric_systems/${selectedMetricId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchMetricSystems();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting metric system:', error);
    }

    
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Metric Systems Management</h1>

      <button
        onClick={openModal}
        className="p-3 bg-[#00B251] text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mb-6"
      >
        + Metric System
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-[#00B251] font-semibold">Add Metric System</h2>

            {/* Form inside the modal */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-20px' }}>Metric System Name</p>
                <input
                  type="text"
                  name="metric_system_name"
                  value={formData.metric_system_name}
                  onChange={handleInputChange}
                  placeholder="Metric System"
                  required
                  className="border p-2 w-full rounded-md"
                />
                <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>
                  Kilogram Value
                </p>
                <input
                  type="number"
                  step="0.0001"
                  name="metric_val_kilogram"
                  value={formData.metric_val_kilogram}
                  onChange={handleInputChange}
                  placeholder="Value in Kilogram"
                  required
                  className="border p-2 w-full rounded-md"
                />
                <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>
                  Gram Value
                </p>
                <input
                  type="number"
                  step="0.0001"
                  name="metric_val_gram"
                  value={formData.metric_val_gram}
                  onChange={handleInputChange}
                  placeholder="Value in Gram"
                  required
                  className="border p-2 w-full rounded-md"
                />
                <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>
                  Pounds Value
                </p>
                <input
                  type="number"
                  step="0.0001"
                  name="metric_val_pounds"
                  value={formData.metric_val_pounds}
                  onChange={handleInputChange}
                  placeholder="Value in Pounds"
                  required
                  className="border p-2 w-full rounded-md"
                />
              </div>

              {/* Buttons for Cancel and Submit */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"  
                  className="bg-green-600 text-white p-2 rounded"
                >
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="flex items-center mt-6">
        <input
          type="text"
          placeholder="Search for metric system"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded-md w-full md:w-1/2"
        />
      </div>

      <table className="min-w-full mt-8 border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-[#00B251] text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Kilogram</th>
            <th className="p-2 border">Gram</th>
            <th className="p-2 border">Pounds</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMetricSystems.map((metric) => (
            <tr key={metric.metric_system_id} className="text-center">
              <td className="p-2 border">{metric.metric_system_id}</td>
              <td className="p-2 border">{metric.metric_system_name}</td>
              <td className="p-2 border">{metric.metric_val_kilogram}</td>
              <td className="p-2 border">{metric.metric_val_gram}</td>
              <td className="p-2 border">{metric.metric_val_pounds}</td>
              <td className="p-2 border">
                <button onClick={() => handleEdit(metric)} className="bg-[#00B251] text-white py-1 px-3 rounded-md mx-1">Edit</button>
                <button onClick={() => { setSelectedMetricId(metric.metric_system_id); setShowDeleteModal(true); }} className="bg-red-500 text-white py-1 px-3 rounded-md mx-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl text-[#00B251] font-semibold">Edit Metric System</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

            <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-10px' }}>Metric System Name</p>
              <input
                type="text"
                name="metric_system_name"
                value={formData.metric_system_name}
                onChange={handleInputChange}
                placeholder="Metric System Name"
                required
                className="border p-2 w-full rounded-md"
              />

            <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Kilogram</p>
              <input
                type="number"
                step="0.0001"
                name="metric_val_kilogram"
                value={formData.metric_val_kilogram}
                onChange={handleInputChange}
                placeholder="Kilogram Value"
                required
                className="border p-2 w-full rounded-md"
              />
            <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Gram</p>
              <input
                type="number"
                step="0.0001"
                name="metric_val_gram"
                value={formData.metric_val_gram}
                onChange={handleInputChange}
                placeholder="Gram Value"
                required
                className="border p-2 w-full rounded-md"
              />
            <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Pounds</p>
              <input
                type="number"
                step="0.0001"
                name="metric_val_pounds"
                value={formData.metric_val_pounds}
                onChange={handleInputChange}
                placeholder="Pounds Value"
                required
                className="border p-2 w-full rounded-md"
              />
             <div className="flex justify-end mt-4">
    
                <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white p-2 rounded mr-2">Cancel</button>

                <button
                  type="submit"  
                  className="bg-green-600 text-white p-2 rounded"
                >
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this metric system?</p>
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

export default MetricSystemPage;
