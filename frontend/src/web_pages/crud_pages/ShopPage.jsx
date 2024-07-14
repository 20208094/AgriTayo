import React, { useState, useEffect } from 'react';

function ShopPage() {
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    shop_name: '',
    shop_address: '',
    shop_description: '',
    user_id: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchShops();
    fetchUsers();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
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
    const url = isEdit ? `/api/shops/${formData.shop_id}` : '/api/shops';
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
      fetchShops();
      setFormData({
        shop_name: '',
        shop_address: '',
        shop_description: '',
        user_id: ''
      });
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (shop) => {
    setFormData(shop);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/shops/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchShops();
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Shops Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="shop_name"
          value={formData.shop_name}
          onChange={handleInputChange}
          placeholder="Shop Name"
          required
        />
        <input
          type="text"
          name="shop_address"
          value={formData.shop_address}
          onChange={handleInputChange}
          placeholder="Shop Address"
        />
        <input
          type="text"
          name="shop_description"
          value={formData.shop_description}
          onChange={handleInputChange}
          placeholder="Shop Description"
        />
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
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
            <th style={{ border: '1px solid black', padding: '8px' }}>Shop Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Shop Address</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Shop Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.shop_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_address}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{users.find(user => user.user_id === shop.user_id)?.firstname} {users.find(user => user.user_id === shop.user_id)?.lastname}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(shop)}>Edit</button>
                <button onClick={() => handleDelete(shop.shop_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShopPage;
