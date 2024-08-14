import React, { useState, useEffect } from 'react';

function OrderStatusPage() {
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [formData, setFormData] = useState({
        order_status_name: '',
        order_status_description: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchOrderStatuses();
    }, []);

    const fetchOrderStatuses = async () => {
        try {
            const response = await fetch('/api/order_statuses');
            if (!response.ok) {
                throw new Error('Failed to fetch order statuses');
            }
            const data = await response.json();
            setOrderStatuses(data);
        } catch (error) {
            console.error('Error fetching order statuses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await fetch(`/api/order_statuses/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch('/api/order_statuses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            fetchOrderStatuses();
            setFormData({ order_status_name: '', order_status_description: '' });
            setIsEdit(false);
            setEditId(null);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (status) => {
        setFormData({ order_status_name: status.order_status_name, order_status_description: status.order_status_description });
        setIsEdit(true);
        setEditId(status.order_status_id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/order_statuses/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete order status');
            }
            fetchOrderStatuses();
        } catch (error) {
            console.error('Error deleting order status:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Order Status Management</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="order_status_name"
                    value={formData.order_status_name}
                    onChange={handleInputChange}
                    placeholder="Order Status Name"
                    required
                />
                <input
                    type="text"
                    name="order_status_description"
                    value={formData.order_status_description}
                    onChange={handleInputChange}
                    placeholder="Order Status Description"
                    required
                />
                <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orderStatuses.map((status) => (
                        <tr key={status.order_status_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{status.order_status_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{status.order_status_name}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{status.order_status_description}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(status)}>Edit</button>
                                <button onClick={() => handleDelete(status.order_status_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderStatusPage;
