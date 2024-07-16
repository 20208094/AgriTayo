import React, { useState, useEffect } from 'react';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [metricSystems, setMetricSystems] = useState([]);
    const [formData, setFormData] = useState({
        total_price: '',
        total_weight: '',
        status_id: '',
        user_id: '',
        order_metric_system_id: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchStatuses();
        fetchUsers();
        fetchMetricSystems();
    }, []);

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

    const fetchStatuses = async () => {
        try {
            const response = await fetch('/api/order_statuses');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStatuses(data);
        } catch (error) {
            console.error('Error fetching order statuses:', error);
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
        const url = isEdit ? `/api/orders/${formData.order_id}` : '/api/orders';
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
            fetchOrders();
            setFormData({
                total_price: '',
                total_weight: '',
                status_id: '',
                user_id: '',
                order_metric_system_id: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (order) => {
        setFormData(order);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Orders Management</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="total_price"
                    value={formData.total_price}
                    onChange={handleInputChange}
                    placeholder="Total Price"
                    required
                />
                <input
                    type="text"
                    name="total_weight"
                    value={formData.total_weight}
                    onChange={handleInputChange}
                    placeholder="Total Weight"
                />
                <select
                    name="status_id"
                    value={formData.status_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                        <option key={status.order_status_id} value={status.order_status_id}>
                            {status.order_status_name}
                        </option>
                    ))}
                </select>
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
                <select
                    name="order_metric_system_id"
                    value={formData.order_metric_system_id}
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
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Total Weight</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Order Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Metric System</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{order.order_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{order.total_price}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{order.total_weight}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {statuses.find((status) => status.order_status_id === order.status_id)?.order_status_name || 'Unknown'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {users.find((user) => user.user_id === order.user_id)?.firstname} {users.find((user) => user.user_id === order.user_id)?.lastname}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(order.order_date).toLocaleString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {metricSystems.find((metric) => metric.metric_system_id === order.order_metric_system_id)?.metric_system_name || 'Unknown'}
                            </td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(order)}>Edit</button>
                                <button onClick={() => handleDelete(order.order_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrdersPage;