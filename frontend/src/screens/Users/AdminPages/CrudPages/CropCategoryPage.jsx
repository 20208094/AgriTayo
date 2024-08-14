import React, { useState, useEffect } from 'react';

function CropCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    crop_category_name: '',
    crop_category_description: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/crop_categories');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/api/crop_categories/${formData.crop_category_id}` : '/api/crop_categories';
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
      fetchCategories();
      setFormData({
        crop_category_name: '',
        crop_category_description: ''
      });
      setIsEdit(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/crop_categories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchCategories();
    } catch (error) {
      console.error('Error deleting crop category:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Crop Categories Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="crop_category_name"
          value={formData.crop_category_name}
          onChange={handleInputChange}
          placeholder="Crop Category Name"
          required
        />
        <input
          type="text"
          name="crop_category_description"
          value={formData.crop_category_description}
          onChange={handleInputChange}
          placeholder="Crop Category Description"
        />
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.crop_category_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(category)}>Edit</button>
                <button onClick={() => handleDelete(category.crop_category_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CropCategoryPage;
