import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function CartPage() {
    const [carts, setCarts] = useState([]);
    const [users, setUsers] = useState([]);
    const [metricSystems, setMetricSystems] = useState([]);
    const [formData, setFormData] = useState({
        cart_total_price: '',
        cart_total_weight: '',
        cart_user_id: '',
        cart_metric_system_id: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchCarts();
        fetchUsers();
        fetchMetricSystems();
    }, []);

    const fetchCarts = async () => {
        try {
            const response = await fetch('/api/carts', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCarts(data);
        } catch (error) {
            console.error('Error fetching carts:', error);
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

    const fetchMetricSystems = async () => {
        try {
            const response = await fetch('/api/metric_systems', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
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
        const url = isEdit ? `/api/carts/${formData.cart_id}` : '/api/carts';
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
            fetchCarts();
            setFormData({
                cart_total_price: '',
                cart_total_weight: '',
                cart_user_id: '',
                cart_metric_system_id: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (cart) => {
        setFormData(cart);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/carts/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchCarts();
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1 style={{ marginBottom: '20px' }}>Cart Management</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="number"
                    step="0.01"
                    name="cart_total_price"
                    value={formData.cart_total_price}
                    onChange={handleInputChange}
                    placeholder="Total Price"
                    required
                    style={{ marginRight: '10px', marginBottom: '10px', padding: '5px' }}
                />
                <input
                    type="number"
                    step="0.0001"
                    name="cart_total_weight"
                    value={formData.cart_total_weight}
                    onChange={handleInputChange}
                    placeholder="Total Weight"
                    style={{ marginRight: '10px', marginBottom: '10px', padding: '5px' }}
                />
                <select
                    name="cart_user_id"
                    value={formData.cart_user_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', marginBottom: '10px', padding: '5px' }}
                >
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>{user.firstname}</option>
                    ))}
                </select>
                <select
                    name="cart_metric_system_id"
                    value={formData.cart_metric_system_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', marginBottom: '10px', padding: '5px' }}
                >
                    <option value="">Select Metric System</option>
                    {metricSystems.map((metricSystem) => (
                        <option key={metricSystem.metric_system_id} value={metricSystem.metric_system_id}>{metricSystem.metric_system_name}</option>
                    ))}
                </select>
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Weight</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Metric System</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {carts.map((cart) => (
                        <tr key={cart.cart_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cart.cart_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cart.cart_total_price}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cart.cart_total_weight}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {users.find(user => user.user_id === cart.cart_user_id)?.username || 'N/A'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {metricSystems.find(metric => metric.metric_system_id === cart.cart_metric_system_id)?.metric_system_name || 'N/A'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(cart)}>Edit</button>
                                <button onClick={() => handleDelete(cart.cart_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartPage;
