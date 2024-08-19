import React, { useState, useEffect } from 'react';

// API key (replace with your environment variable or API key as needed)
const API_KEY = import.meta.env.VITE_API_KEY;

function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        order_id: '',
        payment_method: '',
        payment_status: '',
        amount: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchPayments();
        fetchOrders();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await fetch('/api/payments', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/payments/${formData.payment_id}` : '/api/payments';
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
            fetchPayments();
            setFormData({
                order_id: '',
                payment_method: '',
                payment_status: '',
                amount: ''
            });
            setIsEdit(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (payment) => {
        setFormData(payment);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/payments/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchPayments();
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Payments Management</h1>

            <form onSubmit={handleSubmit}>
                <select
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Order</option>
                    {orders.map((order) => (
                        <option key={order.order_id} value={order.order_id}>
                            Order #{order.order_id} - ${order.total_price}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    placeholder="Payment Method"
                    required
                />
                <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Payment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>
                <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    required
                />
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Order ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Payment Method</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Payment Status</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Payment Date</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.payment_id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{payment.payment_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{payment.order_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{payment.payment_method}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{payment.payment_status}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{payment.amount}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(payment.payment_date).toLocaleString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(payment)}>Edit</button>
                                <button onClick={() => handleDelete(payment.payment_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PaymentsPage;
