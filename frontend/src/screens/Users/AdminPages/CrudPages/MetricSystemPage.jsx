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
  const closeModal = () => setIsModalOpen(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState(null);

  const openModal = () => {
    setFormData({
      metric_system_name: '',
      metric_val_kilogram: '',
      metric_val_gram: '',
      metric_val_pounds: '',
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

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
      setIsModalOpen(false);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const handleEdit = (metric) => {
    setFormData({
      metric_system_id: metric.metric_system_id,
      metric_system_name: metric.metric_system_name,
      metric_val_kilogram: metric.metric_val_kilogram,
      metric_val_gram: metric.metric_val_gram,
      metric_val_pounds: metric.metric_val_pounds
    });
    setIsEdit(true);
    setIsModalOpen(true);
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
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                Metric Systems Management
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Manage and organize measurement systems
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <span className="text-gray-800 font-medium">
                  {filteredMetricSystems.length} Systems
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={openModal}
            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
              hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            + Metric System
          </button>

          <input
            type="text"
            placeholder="Search for metric system"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-96
              focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                {['ID', 'Name', 'Kilogram', 'Gram', 'Pounds', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-4 text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMetricSystems.map((metric) => (
                <tr key={metric.metric_system_id} className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-center">{metric.metric_system_id}</td>
                  <td className="px-6 py-4 text-center font-medium">{metric.metric_system_name}</td>
                  <td className="px-6 py-4 text-center">{metric.metric_val_kilogram} kg</td>
                  <td className="px-6 py-4 text-center">{metric.metric_val_gram} g</td>
                  <td className="px-6 py-4 text-center">{metric.metric_val_pounds} lb</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(metric)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                          transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setSelectedMetricId(metric.metric_system_id); setShowDeleteModal(true); }}
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
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEdit ? 'Edit Metric System' : 'Add Metric System'}
                </h2>
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
                      Kilogram (kg)
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
                      Gram (g)
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
                      Pounds (lb)
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
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
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
              <p className="text-gray-600 mb-6">Are you sure you want to delete this metric system?</p>
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
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricSystemPage;
