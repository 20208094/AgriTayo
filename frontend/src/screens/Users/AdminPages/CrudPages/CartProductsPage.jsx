import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function CartProductsPage() {
    const [cartProducts, setCartProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [crops, setCrops] = useState([]);
    const [users, setUsers] = useState([]);
    const [metricSystems, setMetricSystems] = useState([]);
    const [formData, setFormData] = useState({
        cart_id: '',
        cart_prod_crop_id: '',
        cart_prod_total_weight: '',
        cart_prod_total_price: '',
        cart_prod_user_id: '',
        cart_prod_metric_system_id: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchCartProducts();
        fetchCarts();
        fetchCrops();
        fetchUsers();
        fetchMetricSystems();
    }, []);

    const fetchCartProducts = async () => {
        try {
            const response = await fetch('/api/cart_products', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCartProducts(data);
        } catch (error) {
            console.error('Error fetching cart products:', error);
        }
    };

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

    const fetchCrops = async () => {
        try {
            const response = await fetch('/api/crops', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCrops(data);
        } catch (error) {
            console.error('Error fetching crops:', error);
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
        const url = isEdit ? `/api/cart_products/${formData.cart_prod_id}` : '/api/cart_products';
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
            fetchCartProducts();
            setFormData({
                cart_id: '',
                cart_prod_crop_id: '',
                cart_prod_total_weight: '',
                cart_prod_total_price: '',
                cart_prod_user_id: '',
                cart_prod_metric_system_id: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (cartProduct) => {
        setFormData(cartProduct);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/cart_products/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchCartProducts();
        } catch (error) {
            console.error('Error deleting cart product:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Cart Products Management</h1>

            <form onSubmit={handleSubmit}>
                <select
                    name="cart_id"
                    value={formData.cart_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Cart</option>
                    {carts.map((cart) => (
                        <option key={cart.cart_id} value={cart.cart_id}>
                            Cart ID: {cart.cart_id}
                        </option>
                    ))}
                </select>
                <select
                    name="cart_prod_crop_id"
                    value={formData.cart_prod_crop_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                        <option key={crop.crop_id} value={crop.crop_id}>
                            {crop.crop_name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="cart_prod_total_weight"
                    value={formData.cart_prod_total_weight}
                    onChange={handleInputChange}
                    placeholder="Total Weight"
                />
                <input
                    type="text"
                    name="cart_prod_total_price"
                    value={formData.cart_prod_total_price}
                    onChange={handleInputChange}
                    placeholder="Total Price"
                    required
                />
                <select
                    name="cart_prod_user_id"
                    value={formData.cart_prod_user_id}
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
                <select
                    name="cart_prod_metric_system_id"
                    value={formData.cart_prod_metric_system_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Metric System</option>
                    {metricSystems.map((metric) => (
                        <option key={metric.metric_system_id} value={metric.metric_system_id}>
                            {metric.metric_system_name}
                        </option>
                    ))}
                </select>
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Cart ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Crop</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Weight</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Metric System</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.map((cartProduct) => (
                        <tr key={cartProduct.cart_prod_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cartProduct.cart_prod_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cartProduct.cart_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{crops.find((crop) => crop.crop_id === cartProduct.cart_prod_crop_id)?.crop_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cartProduct.cart_prod_total_weight}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{cartProduct.cart_prod_total_price}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{users.find((user) => user.user_id === cartProduct.cart_prod_user_id)?.firstname} {users.find((user) => user.user_id === cartProduct.cart_prod_user_id)?.lastname}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystems.find((metric) => metric.metric_system_id === cartProduct.cart_prod_metric_system_id)?.metric_system_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(cartProduct)}>Edit</button>
                                <button onClick={() => handleDelete(cartProduct.cart_prod_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartProductsPage;
