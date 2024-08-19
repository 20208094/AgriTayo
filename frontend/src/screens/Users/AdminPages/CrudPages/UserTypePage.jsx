import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function UserTypePage() {
  const [userTypes, setUserTypes] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/user_types', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserTypes(data);
    } catch (error) {
      console.error('Error fetching user types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/user_types/${formData.user_type_id}` : '/api/user_types';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchData();
      setFormData({});
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/user_types/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>User Type Table</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="user_type_id"
          value={formData.user_type_id || ''}
          onChange={handleInputChange}
          className="form-control"
          placeholder="ID"
          required
          disabled={isEdit}
          style={{ marginRight: '10px', marginBottom: '10px', width: '100px' }}
        />
        <input
          type="text"
          name="user_type_name"
          value={formData.user_type_name || ''}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Name"
          required
          style={{ marginRight: '10px', marginBottom: '10px', width: '200px' }}
        />
        <input
          type="text"
          name="user_type_description"
          value={formData.user_type_description || ''}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Description"
          required
          style={{ marginRight: '10px', marginBottom: '10px', width: '300px' }}
        />
        <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
      </form>
      
      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }} className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userTypes.map((type) => (
            <tr key={type.user_type_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{type.user_type_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{type.user_type_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{type.user_type_description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(type)} className="btn btn-sm btn-info mr-1">Edit</button>
                <button onClick={() => handleDelete(type.user_type_id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTypePage;
