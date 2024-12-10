import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchStatuses();
        fetchUsers();
        fetchMetricSystems();
    }, []);

    useEffect(() => {
        setFilteredOrders(
            orders.filter(order =>
                (order.total_price.toString().includes(searchTerm) ||
                    order.total_weight.toString().includes(searchTerm) ||
                    statuses.find(status => status.order_status_id === order.status_id)?.order_status_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    users.find(user => user.user_id === order.user_id)?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    users.find(user => user.user_id === order.user_id)?.lastname.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedStatus === '' || order.status_id === parseInt(selectedStatus))
            )
        );
    }, [orders, searchTerm, selectedStatus]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: { 'x-api-key': API_KEY }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await fetch('/api/order_statuses', {
                headers: { 'x-api-key': API_KEY }
            });
            const data = await response.json();
            setStatuses(data);
        } catch (error) {
            console.error('Error fetching order statuses:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: { 'x-api-key': API_KEY }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMetricSystems = async () => {
        try {
            const response = await fetch('/api/metric_systems', {
                headers: { 'x-api-key': API_KEY }
            });
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

    const handleStatusFilterChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleCreate = async () => {
        try {
            await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify(formData),
            });
            fetchOrders();
            setFormData({ total_price: '', total_weight: '', status_id: '', user_id: '', order_metric_system_id: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await fetch(`/api/orders/${formData.order_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify(formData),
            });
            fetchOrders();
            setIsEdit(false);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleEdit = (order) => {
        setFormData(order);
        setIsEdit(true);
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/orders/${orderToDelete}`, {
                method: 'DELETE',
                headers: { 'x-api-key': API_KEY }
            });
            fetchOrders();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        const logoWidth = 50, logoHeight = 50, pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - logoWidth) / 2;
        doc.addImage(MainLogo, 'PNG', xPosition, 10, logoWidth, logoHeight);
        doc.text("Orders List", pageWidth / 2, 70, { align: "center" });

        doc.autoTable({
            startY: 80,
            head: [['ID', 'Total Price', 'Total Weight', 'Status', 'User', 'Order Date', 'Metric System']],
            body: filteredOrders.map((order) => [
                order.order_id,
                order.total_price,
                order.total_weight,
                statuses.find(status => status.order_status_id === order.status_id)?.order_status_name || 'Unknown',
                `${users.find(user => user.user_id === order.user_id)?.firstname || ''} ${users.find(user => user.user_id === order.user_id)?.lastname || ''}`,
                new Date(order.order_date).toLocaleString(),
                metricSystems.find(metric => metric.metric_system_id === order.order_metric_system_id)?.metric_system_name || 'Unknown',
            ]),
            headStyles: { fillColor: [0, 178, 81], halign: 'center', valign: 'middle' },
        });
        doc.save('orders.pdf');
    };

    const openModal = () => {
        setFormData({ total_price: '', total_weight: '', status_id: '', user_id: '', order_metric_system_id: '' });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                                Orders Management
                            </h1>
                            <p className="text-gray-700 text-lg font-medium">
                                Manage and track orders efficiently
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-gray-800 font-medium">
                                    {filteredOrders.length} Orders
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Filter, Search and Buttons */}
                <div className="flex flex-col sm:flex-row sm:space-x-2 items-center mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Orders"
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/4
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-2 sm:mb-0"
                    />

                    <select
                        onChange={handleStatusFilterChange}
                        value={selectedStatus}
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/4
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-2 sm:mb-0"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status.order_status_id} value={status.order_status_id}>
                                {status.order_status_name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={openModal}
                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-xl
                            hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto mb-2 sm:mb-0"
                    >
                        + Add Order
                    </button>

                    <button
                        onClick={exportToPDF}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        Export to PDF
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                {['ID', 'Total Price', 'Total Weight', 'Status', 'User', 'Order Date', 'Metric System', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-center">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.order_id} className="hover:bg-white/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-center">{order.order_id}</td>
                                    <td className="px-6 py-4 text-center">{order.total_price}</td>
                                    <td className="px-6 py-4 text-center">{order.total_weight}</td>
                                    <td className="px-6 py-4 text-center">
                                        {statuses.find(status => status.order_status_id === order.status_id)?.order_status_name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {users.find(user => user.user_id === order.user_id)?.firstname} {users.find(user => user.user_id === order.user_id)?.lastname}
                                    </td>
                                    <td className="px-6 py-4 text-center">{new Date(order.order_date).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        {metricSystems.find(metric => metric.metric_system_id === order.order_metric_system_id)?.metric_system_name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                                                    transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setOrderToDelete(order.order_id); setShowDeleteModal(true); }}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600
                                                    transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {isEdit ? 'Edit Order' : 'Create New Order'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <p className="text-l font-bold mb-2">Total Price</p>
                                            <input
                                                type="text"
                                                name="total_price"
                                                value={formData.total_price}
                                                onChange={handleInputChange}
                                                placeholder="Total Price"
                                                className="p-2 border border-gray-300 rounded w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <p className="text-l font-bold mb-2">Total Weight</p>
                                            <input
                                                type="text"
                                                name="total_weight"
                                                value={formData.total_weight}
                                                onChange={handleInputChange}
                                                placeholder="Total Weight"
                                                className="p-2 border border-gray-300 rounded w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <p className="text-l font-bold mb-2">Order Status</p>
                                            <select
                                                name="status_id"
                                                value={formData.status_id}
                                                onChange={handleInputChange}
                                                className="p-2 border border-gray-300 rounded w-full"
                                                required
                                            >
                                                <option value="">Select Status</option>
                                                {statuses.map((status) => (
                                                    <option key={status.order_status_id} value={status.order_status_id}>
                                                        {status.order_status_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-l font-bold mb-2">User</p>
                                            <select
                                                name="user_id"
                                                value={formData.user_id}
                                                onChange={handleInputChange}
                                                className="p-2 border border-gray-300 rounded w-full"
                                                required
                                            >
                                                <option value="">Select User</option>
                                                {users.map((user) => (
                                                    <option key={user.user_id} value={user.user_id}>
                                                        {user.firstname} {user.lastname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-l font-bold mb-2">Metric System</p>
                                            <select
                                                name="order_metric_system_id"
                                                value={formData.order_metric_system_id}
                                                onChange={handleInputChange}
                                                className="p-2 border border-gray-300 rounded w-full"
                                                required
                                            >
                                                <option value="">Select Metric System</option>
                                                {metricSystems.map((metric) => (
                                                    <option key={metric.metric_system_id} value={metric.metric_system_id}>
                                                        {metric.metric_system_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                                transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700
                                                transition-colors duration-200"
                                        >
                                            {isEdit ? 'Save Changes' : 'Create Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Order</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                        <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-20px' }}>Total Price</p>
                                        <input
                                            type="text"
                                            name="total_price"
                                            value={formData.total_price}
                                            onChange={handleInputChange}
                                            placeholder="Total Price"
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Total Weight</p>
                                        <input
                                            type="text"
                                            name="total_weight"
                                            value={formData.total_weight}
                                            onChange={handleInputChange}
                                            placeholder="Total Weight"
                                            className="p-2 border border-gray-300 rounded"
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Order Status</p>
                                        <select
                                            name="status_id"
                                            value={formData.status_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            {statuses.map((status) => (
                                                <option key={status.order_status_id} value={status.order_status_id}>
                                                    {status.order_status_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>User</p>
                                        <select
                                            name="user_id"
                                            value={formData.user_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.map((user) => (
                                                <option key={user.user_id} value={user.user_id}>
                                                    {user.firstname} {user.lastname}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-20px' }}>Metric System</p>
                                        <select
                                            name="order_metric_system_id"
                                            value={formData.order_metric_system_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Metric System</option>
                                            {metricSystems.map((metric) => (
                                                <option key={metric.metric_system_id} value={metric.metric_system_id}>
                                                    {metric.metric_system_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                                transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700
                                                transition-colors duration-200"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this order?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200
                                        transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600
                                        transition-colors duration-200"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
