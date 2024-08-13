import React, { useState, useEffect } from 'react';

function OrderProductsPage() {
    const [orderProducts, setOrderProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [crops, setCrops] = useState([]);
    const [users, setUsers] = useState([]);
    const [metricSystems, setMetricSystems] = useState([]);
    const [formData, setFormData] = useState({
        order_id: '',
        order_prod_crop_id: '',
        order_prod_total_weight: '',
        order_prod_total_price: '',
        order_prod_user_id: '',
        order_prod_metric_system_id: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchOrderProducts();
        fetchOrders();
        fetchCrops();
        fetchUsers();
        fetchMetricSystems();
    }, []);

    const fetchOrderProducts = async () => {
        try {
            const response = await fetch('/api/order_products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrderProducts(data);
        } catch (error) {
            console.error('Error fetching order products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchCrops = async () => {
        try {
            const response = await fetch('/api/crops');
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
        const url = isEdit ? `/api/order_products/${formData.order_prod_id}` : '/api/order_products';
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
            fetchOrderProducts();
            setFormData({
                order_id: '',
                order_prod_crop_id: '',
                order_prod_total_weight: '',
                order_prod_total_price: '',
                order_prod_user_id: '',
                order_prod_metric_system_id: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (orderProduct) => {
        setFormData(orderProduct);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/order_products/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchOrderProducts();
        } catch (error) {
            console.error('Error deleting order product:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1 style={{ marginBottom: '20px' }}>Order Products Management</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <select
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                    required
                >
                    <option value="">Select Order</option>
                    {orders.map((order) => (
                        <option key={order.order_id} value={order.order_id}>
                            {order.order_id}
                        </option>
                    ))}
                </select>
                <select
                    name="order_prod_crop_id"
                    value={formData.order_prod_crop_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '5px' }}
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
                    name="order_prod_total_weight"
                    value={formData.order_prod_total_weight}
                    onChange={handleInputChange}
                    placeholder="Order Product Total Weight"
                    style={{ marginRight: '10px', padding: '5px' }}
                    required
                />
                <input
                    type="text"
                    name="order_prod_total_price"
                    value={formData.order_prod_total_price}
                    onChange={handleInputChange}
                    placeholder="Order Product Total Price"
                    style={{ marginRight: '10px', padding: '5px' }}
                    required
                />
                <select
                    name="order_prod_user_id"
                    value={formData.order_prod_user_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '5px' }}
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
                    name="order_prod_metric_system_id"
                    value={formData.order_prod_metric_system_id}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                    required
                >
                    <option value="">Select Metric System</option>
                    {metricSystems.map((metricSystem) => (
                        <option key={metricSystem.metric_system_id} value={metricSystem.metric_system_id}>
                            {metricSystem.metric_system_name}
                        </option>
                    ))}
                </select>
                <button type="submit" style={{ padding: '5px' }}>{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Order ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Product Crop Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Weight</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Metric System Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orderProducts.map((orderProduct) => (
                        <tr key={orderProduct.order_prod_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{orderProduct.order_prod_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{orderProduct.order_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{crops.find(crop => crop.crop_id === orderProduct.order_prod_crop_id)?.crop_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{orderProduct.order_prod_total_weight}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{orderProduct.order_prod_total_price}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{users.find(user => user.user_id === orderProduct.order_prod_user_id)?.firstname} {users.find(user => user.user_id === orderProduct.order_prod_user_id)?.lastname}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{metricSystems.find(metricSystem => metricSystem.metric_system_id === orderProduct.order_prod_metric_system_id)?.metric_system_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(orderProduct)}>Edit</button>
                                <button onClick={() => handleDelete(orderProduct.order_prod_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderProductsPage;
