import React, { useState, useEffect } from 'react';

function MetricSystemPage() {
  const [metricSystems, setMetricSystems] = useState([]);
  const [formData, setFormData] = useState({
    metric_system_name: '',
    metric_val_kilogram: '',
    metric_val_gram: '',
    metric_val_pounds: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchMetricSystems();
  }, []);

  const fetchMetricSystems = async () => {
    try {
      const response = await fetch('/api/metric_systems');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMetricSystems(data);
    } catch (error) {
      console.error('Error fetching metric systems:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/metric_systems/${formData.metric_system_id}` : '/api/metric_systems';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchMetricSystems();
      setFormData({
        metric_system_name: '',
        metric_val_kilogram: '',
        metric_val_gram: '',
        metric_val_pounds: ''
      });
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (metricSystem) => {
    setFormData(metricSystem);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/metric_systems/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchMetricSystems();
    } catch (error) {
      console.error('Error deleting metric system:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Metric Systems Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="metric_system_name"
          value={formData.metric_system_name}
          onChange={handleInputChange}
          placeholder="Metric System Name"
          required
        />
        <input
          type="number"
          step="0.0001"
          name="metric_val_kilogram"
          value={formData.metric_val_kilogram}
          onChange={handleInputChange}
          placeholder="Kilogram Value"
          required
        />
        <input
          type="number"
          step="0.0001"
          name="metric_val_gram"
          value={formData.metric_val_gram}
          onChange={handleInputChange}
          placeholder="Gram Value"
          required
        />
        <input
          type="number"
          step="0.0001"
          name="metric_val_pounds"
          value={formData.metric_val_pounds}
          onChange={handleInputChange}
          placeholder="Pounds Value"
          required
        />
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Kilogram Value</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Gram Value</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Pounds Value</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {metricSystems.map((metricSystem) => (
            <tr key={metricSystem.metric_system_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystem.metric_system_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystem.metric_system_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystem.metric_val_kilogram}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystem.metric_val_gram}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystem.metric_val_pounds}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(metricSystem)}>Edit</button>
                <button onClick={() => handleDelete(metricSystem.metric_system_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MetricSystemPage;
