// frontend/src/web_pages/OrderTrackingPage.jsx
import React, { useState, useEffect } from 'react';

function OrderTrackingPage() {
    const [trackings, setTrackings] = useState([]);
    const [formData, setFormData] = useState({
        order_id: '',
        status: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchOrderTrackings();
    }, []);

    const fetchOrderTrackings = async () => {
        try {
            const response = await fetch('/api/order_trackings');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTrackings(data);
        } catch (error) {
            console.error('Error fetching order trackings:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/order_trackings/${formData.tracking_id}` : '/api/order_trackings';
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
            fetchOrderTrackings();
            setFormData({
                order_id: '',
                status: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (tracking) => {
        setFormData(tracking);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/order_trackings/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchOrderTrackings();
        } catch (error) {
            console.error('Error deleting order tracking:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Order Tracking Management</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    placeholder="Order ID"
                    required
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Placed">Placed</option>
                    <option value="Processed">Processed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Order ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Update Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trackings.map((tracking) => (
                        <tr key={tracking.tracking_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{tracking.tracking_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{tracking.order_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{tracking.status}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(tracking.update_date).toLocaleString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(tracking)}>Edit</button>
                                <button onClick={() => handleDelete(tracking.tracking_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderTrackingPage;
