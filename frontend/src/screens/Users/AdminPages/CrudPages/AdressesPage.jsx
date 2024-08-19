import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    user_id: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchUsers();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/addresses/${formData.address_id}` : '/api/addresses';
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
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchAddresses();
      setFormData({
        address: '',
        user_id: ''
      });
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Addresses Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          required
        />
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.address_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{address.address_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{address.address}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {users.find(user => user.user_id === address.user_id)?.firstname} {users.find(user => user.user_id === address.user_id)?.lastname}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(address)}>Edit</button>
                <button onClick={() => handleDelete(address.address_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddressesPage;
