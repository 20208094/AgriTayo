import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function ShopsPage() {
    const [shops, setShops] = useState([]);
    const [formData, setFormData] = useState({
        shop_id: '',
        shop_name: '',
        shop_address: '',
        latitude: '',    // Separate latitude input
        longitude: '',   // Separate longitude input
        shop_description: '',
        user_id: '',
        image: null, // Field for shop image
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const response = await fetch('/api/shops', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine latitude and longitude into POINT format
        // const shop_location = `POINT(${formData.longitude} ${formData.latitude})`;

        const url = isEdit ? `/api/shops/${formData.shop_id}` : '/api/shops';
        const method = isEdit ? 'PUT' : 'POST';

        const formPayload = new FormData();
        formPayload.append('shop_name', formData.shop_name);
        formPayload.append('shop_address', formData.shop_address);
        formPayload.append('longitude', formData.longitude);
        formPayload.append('latitude', formData.latitude);
        formPayload.append('shop_description', formData.shop_description);
        formPayload.append('user_id', formData.user_id);
        if (formData.image) {
            formPayload.append('image', formData.image);
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-api-key': API_KEY,
                },
                body: formPayload,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchShops();
            setFormData({
                shop_id: '',
                shop_name: '',
                shop_address: '',
                latitude: '',
                longitude: '',
                shop_description: '',
                user_id: '',
                image: null,
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (shop) => {
        setFormData({
            shop_id: shop.shop_id,
            shop_name: shop.shop_name,
            shop_address: shop.shop_address,
            latitude: shop.shop_location.split(' ')[1] || '', // Extract latitude
            longitude: shop.shop_location.split(' ')[0].replace('POINT(', '') || '', // Extract longitude
            shop_description: shop.shop_description,
            user_id: shop.user_id,
            image: null, // Reset image to avoid using the old one
        });
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/shops/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
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
            <h1>Shop Management</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="hidden"
                    name="shop_id"
                    value={formData.shop_id}
                />
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
                    required
                />
                <div>
                    <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                        step="any" // Allow decimal values
                        required
                    />
                    <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                        step="any" // Allow decimal values
                        required
                    />
                </div>
                <textarea
                    name="shop_description"
                    value={formData.shop_description}
                    onChange={handleInputChange}
                    placeholder="Shop Description"
                    required
                />
                <input
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    placeholder="User ID"
                    required
                />
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Shop Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Latitude</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Longitude</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Image</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shops.map((shop) => (
                        <tr key={shop.shop_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_address}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.latitude}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.longitude}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.shop_description}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{shop.user_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {shop.shop_image_url && (
                                    <img
                                        src={shop.shop_image_url}
                                        alt={shop.shop_name}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                )}
                            </td>
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

export default ShopsPage;
