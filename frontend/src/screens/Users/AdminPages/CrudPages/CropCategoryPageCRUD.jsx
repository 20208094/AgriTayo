import React, { useState, useEffect } from 'react';

function CropCategoryPageCRUD() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    crop_category_id: '',
    crop_category_name: '',
    crop_category_description: '',
    image: null
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
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      crop_category_id: category.crop_category_id, // Set ID for edit
      crop_category_name: category.crop_category_name,
      crop_category_description: category.crop_category_description,
      image: null
    });
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCategories = categories.filter((category) =>
    category.crop_category_name.toLowerCase().includes(searchQuery) ||
    category.crop_category_description.toLowerCase().includes(searchQuery)
  );

  return (
    <div style={{ padding: '50px' }}>
      <h1>Crop Categories Management</h1>

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="hidden"
          name="crop_category_id"
          value={formData.crop_category_id} // Add hidden field for ID
        />
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
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Image</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.crop_category_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{category.crop_category_description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {category.crop_category_image_url && (
                  <img
                    src={category.crop_category_image_url}
                    alt={category.crop_category_name}
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
              </td>
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

export default CropCategoryPageCRUD;
