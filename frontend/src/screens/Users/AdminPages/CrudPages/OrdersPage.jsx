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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // New state for status filter
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
                (selectedStatus === '' || order.status_id === parseInt(selectedStatus)) // Filter by selected status
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
        setSelectedStatus(e.target.value); // Update selected status filter
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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Orders Management</h1>

            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">
                <input type="text" name="total_price" value={formData.total_price} onChange={handleInputChange} placeholder="Total Price" className="p-2 border rounded w-full md:w-1/3" required />
                <input type="text" name="total_weight" value={formData.total_weight} onChange={handleInputChange} placeholder="Total Weight" className="p-2 border rounded w-full md:w-1/3" />
                
                <select name="status_id" value={formData.status_id} onChange={handleInputChange} className="p-2 border rounded w-full md:w-1/3" required>
                    <option value="">Select Status</option>
                    {statuses.map((status) => <option key={status.order_status_id} value={status.order_status_id}>{status.order_status_name}</option>)}
                </select>
                
                <select name="user_id" value={formData.user_id} onChange={handleInputChange} className="p-2 border rounded w-full md:w-1/3" required>
                    <option value="">Select User</option>
                    {users.map((user) => <option key={user.user_id} value={user.user_id}>{user.firstname} {user.lastname}</option>)}
                </select>
                
                <select name="order_metric_system_id" value={formData.order_metric_system_id} onChange={handleInputChange} className="p-2 border rounded w-full md:w-1/3" required>
                    <option value="">Select Metric System</option>
                    {metricSystems.map((metric) => <option key={metric.metric_system_id} value={metric.metric_system_id}>{metric.metric_system_name}</option>)}
                </select>
                
                <button type="submit" className="p-2 w-full md:w-1/3 bg-[#00B251] text-white rounded">
                    {isEdit ? 'Update Order' : 'Create Order'}
                </button>
            </form>

            {/* Status Filter and Search */}
            <div className="flex justify-between items-center mb-4">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Orders" className="p-2 border rounded w-full md:w-1/3" />
                <select onChange={handleStatusFilterChange} value={selectedStatus} className="p-2 border rounded w-full md:w-1/3">
                    <option value="">All Statuses</option>
                    {statuses.map((status) => <option key={status.order_status_id} value={status.order_status_id}>{status.order_status_name}</option>)}
                </select>
                <button onClick={exportToPDF} className="p-2 bg-[#00B251] text-white rounded ml-2">Export to PDF</button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-[#00B251] text-white">
                        <tr>
                            <th className="p-2 border border-gray-200">ID</th>
                            <th className="p-2 border border-gray-200">Total Price</th>
                            <th className="p-2 border border-gray-200">Total Weight</th>
                            <th className="p-2 border border-gray-200">Status</th>
                            <th className="p-2 border border-gray-200">User</th>
                            <th className="p-2 border border-gray-200">Order Date</th>
                            <th className="p-2 border border-gray-200">Metric System</th>
                            <th className="p-2 border border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.order_id} className="border-b">
                                <td className="p-2 border border-gray-200 text-center">{order.order_id}</td>
                                <td className="p-2 border border-gray-200 text-center">{order.total_price}</td>
                                <td className="p-2 border border-gray-200 text-center">{order.total_weight}</td>
                                <td className="p-2 border border-gray-200 text-center">
                                    {statuses.find(status => status.order_status_id === order.status_id)?.order_status_name || 'Unknown'}
                                </td>
                                <td className="p-2 border border-gray-200 text-center">
                                    {users.find(user => user.user_id === order.user_id)?.firstname} {users.find(user => user.user_id === order.user_id)?.lastname}
                                </td>
                                <td className="p-2 border border-gray-200 text-center">{new Date(order.order_date).toLocaleString()}</td>
                                <td className="p-2 border border-gray-200 text-center">
                                    {metricSystems.find(metric => metric.metric_system_id === order.order_metric_system_id)?.metric_system_name || 'Unknown'}
                                </td>
                                <td className="p-2 border border-gray-200 text-center space-x-2">
                                    <button onClick={() => handleEdit(order)} className="bg-[#00B251] text-white p-1 rounded">Edit</button>
                                    <button onClick={() => { setOrderToDelete(order.order_id); setShowDeleteModal(true); }} className="bg-red-500 text-white p-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md max-w-md w-full space-y-4">
                        <h2 className="text-2xl text-[#00B251] font-semibold">Edit Order</h2>
                        {/* Form fields in modal */}
                        <input type="text" name="total_price" value={formData.total_price} onChange={handleInputChange} placeholder="Total Price" className="p-2 border rounded w-full" required />
                        <input type="text" name="total_weight" value={formData.total_weight} onChange={handleInputChange} placeholder="Total Weight" className="p-2 border rounded w-full" />
                        
                        <select name="status_id" value={formData.status_id} onChange={handleInputChange} className="p-2 border rounded w-full" required>
                            <option value="">Select Status</option>
                            {statuses.map((status) => <option key={status.order_status_id} value={status.order_status_id}>{status.order_status_name}</option>)}
                        </select>
                        
                        <select name="user_id" value={formData.user_id} onChange={handleInputChange} className="p-2 border rounded w-full" required>
                            <option value="">Select User</option>
                            {users.map((user) => <option key={user.user_id} value={user.user_id}>{user.firstname} {user.lastname}</option>)}
                        </select>
                        
                        <select name="order_metric_system_id" value={formData.order_metric_system_id} onChange={handleInputChange} className="p-2 border rounded w-full" required>
                            <option value="">Select Metric System</option>
                            {metricSystems.map((metric) => <option key={metric.metric_system_id} value={metric.metric_system_id}>{metric.metric_system_name}</option>)}
                        </select>
                        
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleUpdate} className="px-4 py-2 bg-[#00B251] text-white rounded">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this order?</h3>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersPage;
