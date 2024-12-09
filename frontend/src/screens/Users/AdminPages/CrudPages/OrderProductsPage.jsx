import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

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
    const [isCreate, setIsCreate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchOrderProducts();
        fetchOrders();
        fetchCrops();
        fetchUsers();
        fetchMetricSystems();
    }, []);

    const fetchOrderProducts = async () => {
        try {
            const response = await fetch('/api/order_products', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
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
        const url = isEdit ? `/api/order_products/${formData.order_prod_id}` : '/api/order_products';
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
            fetchOrderProducts();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (orderProduct) => {
        setFormData(orderProduct);
        setIsEdit(true); // Switch to edit mode
        setEditModalOpen(true); // Open the modal
    };

    const handleCreate = () => {
        console.log("Create button clicked");
        setFormData({
            order_id: '',
            order_prod_crop_id: '',
            order_prod_total_weight: '',
            order_prod_total_price: '',
            order_prod_user_id: '',
            order_prod_metric_system_id: '',
        });
        setIsCreate(true); // Set it to true for create
        setCreateModalOpen(true); // Open the modal
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/order_products/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchOrderProducts();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting order product:', error);
        }
    };

    const filteredOrderProducts = orderProducts.filter(orderProduct => {
        const cropName = crops.find(crop => crop.crop_id === orderProduct.order_prod_crop_id)?.crop_name.toLowerCase() || '';
        const userName = users.find(user => user.user_id === orderProduct.order_prod_user_id);
        const userFullName = userName ? `${userName.firstname} ${userName.lastname}`.toLowerCase() : '';

        if (filterType === 'crop' && cropName) {
            return cropName.includes(searchTerm.toLowerCase());
        } else if (filterType === 'user' && userFullName) {
            return userFullName.includes(searchTerm.toLowerCase());
        } else if (filterType === 'weight') {
            return orderProduct.order_prod_total_weight.toString().includes(searchTerm);
        } else if (filterType === 'price') {
            return orderProduct.order_prod_total_price.toString().includes(searchTerm);
        }

        return (
            cropName.includes(searchTerm.toLowerCase()) ||
            userFullName.includes(searchTerm.toLowerCase()) ||
            orderProduct.order_prod_total_weight.toString().includes(searchTerm) ||
            orderProduct.order_prod_total_price.toString().includes(searchTerm)
        );
    });

    // PDF table design
    const exportToPDF = () => {
        const doc = new jsPDF('landscape'); // Set the PDF to landscape mode

        const logoWidth = 50;
        const logoHeight = 50;
        const marginBelowLogo = 5;
        const textMargin = 5;

        const pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - logoWidth) / 2; // Center the logo horizontally

        doc.addImage(MainLogo, 'PNG', xPosition, 10, logoWidth, logoHeight);
        const textYPosition = 10 + logoHeight + textMargin;
        doc.text("Order Product List", xPosition + logoWidth / 2, textYPosition, { align: "center" });

        const tableStartY = textYPosition + marginBelowLogo + 5;

        const tableColumn = ['ID', 'Order ID', 'Product Crop Name', 'Total Weight', 'Total Price', 'User Name', 'Metric System Name'];
        const tableRows = [];

        filteredOrderProducts.forEach(orderProduct => {
            const cropName = crops.find(crop => crop.crop_id === orderProduct.order_prod_crop_id)?.crop_name || '';
            const userName = users.find(user => user.user_id === orderProduct.order_prod_user_id);
            const userFullName = userName ? `${userName.firstname} ${userName.lastname}` : '';
            const metricSystemName = metricSystems.find(metric => metric.metric_system_id === orderProduct.order_prod_metric_system_id)?.metric_system_name || '';

            tableRows.push([
                orderProduct.order_prod_id,
                orderProduct.order_id,
                cropName,
                orderProduct.order_prod_total_weight,
                orderProduct.order_prod_total_price,
                userFullName,
                metricSystemName,
            ]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: tableStartY,
            headStyles: {
                fillColor: [0, 128, 0],
                halign: 'center',
                valign: 'middle'
            },
        });
        doc.save('order_products.pdf');
    };

    const resetForm = () => {
        setFormData({
            order_id: '',
            order_prod_crop_id: '',
            order_prod_total_weight: '',
            order_prod_total_price: '',
            order_prod_user_id: '',
            order_prod_metric_system_id: ''
        });
        setIsEdit(false);
        setEditModalOpen(false);
        setIsCreate(false);
        setCreateModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                                Order Products Management
                            </h1>
                            <p className="text-gray-700 text-lg font-medium">
                                Manage and track order products efficiently
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-gray-800 font-medium">
                                    {filteredOrderProducts.length} Products
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row sm:space-x-2 items-center mb-6">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/4
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-2 sm:mb-0"
                    >
                        <option value="">Select Filter Type</option>
                        <option value="crop">Crop Name</option>
                        <option value="user">User Name</option>
                        <option value="weight">Total Weight</option>
                        <option value="price">Total Price</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search Order Products"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2 w-full sm:w-1/4
                            focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg mb-2 sm:mb-0"
                    />

                    <button
                        onClick={handleCreate}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto mb-2 sm:mb-0"
                    >
                        + Add Order Product
                    </button>

                    <button
                        onClick={exportToPDF}
                        className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                            hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                        Export to PDF
                    </button>
                </div>

                {/* Order Products Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                {['ID', 'Order ID', 'Product Crop Name', 'Total Weight', 'Total Price', 'User Name', 'Metric System Name', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-center">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrderProducts.map((orderProduct) => (
                                <tr key={orderProduct.order_prod_id} className="hover:bg-white/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-center">{orderProduct.order_prod_id}</td>
                                    <td className="px-6 py-4 text-center">{orderProduct.order_id}</td>
                                    <td className="px-6 py-4 text-center">{crops.find(crop => crop.crop_id === orderProduct.order_prod_crop_id)?.crop_name}</td>
                                    <td className="px-6 py-4 text-center">{orderProduct.order_prod_total_weight}</td>
                                    <td className="px-6 py-4 text-center">{orderProduct.order_prod_total_price}</td>
                                    <td className="px-6 py-4 text-center">{users.find(user => user.user_id === orderProduct.order_prod_user_id)?.firstname} {users.find(user => user.user_id === orderProduct.order_prod_user_id)?.lastname}</td>
                                    <td className="px-6 py-4 text-center">{metricSystems.find(metricSystem => metricSystem.metric_system_id === orderProduct.order_prod_metric_system_id)?.metric_system_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(orderProduct)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                                                    transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setDeleteId(orderProduct.order_prod_id); setDeleteModalOpen(true); }}
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

                {/* Create Modal */}
                {createModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Order Product</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-10px' }}>Order ID</p>
                                        <select
                                            name="order_id"
                                            value={formData.order_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Order</option>
                                            {orders.map((order) => (
                                                <option key={order.order_id} value={order.order_id}>
                                                    {order.order_id}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Product Crop Name</p>
                                        <select
                                            name="order_prod_crop_id"
                                            value={formData.order_prod_crop_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Crop</option>
                                            {crops.map((crop) => (
                                                <option key={crop.crop_id} value={crop.crop_id}>
                                                    {crop.crop_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Total Weight</p>
                                        <input
                                            type="text"
                                            name="order_prod_total_weight"
                                            value={formData.order_prod_total_weight}
                                            onChange={handleInputChange}
                                            placeholder="Order Product Total Weight"
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Total Price</p>
                                        <input
                                            type="text"
                                            name="order_prod_total_price"
                                            value={formData.order_prod_total_price}
                                            onChange={handleInputChange}
                                            placeholder="Order Product Total Price"
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>User</p>
                                        <select
                                            name="order_prod_user_id"
                                            value={formData.order_prod_user_id}
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
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Metric System</p>
                                        <select
                                            name="order_prod_metric_system_id"
                                            value={formData.order_prod_metric_system_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Metric System</option>
                                            {metricSystems.map((metricSystem) => (
                                                <option key={metricSystem.metric_system_id} value={metricSystem.metric_system_id}>
                                                    {metricSystem.metric_system_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCreateModalOpen(false);
                                                setFormData({
                                                    order_id: '',
                                                    order_prod_crop_id: '',
                                                    order_prod_total_weight: '',
                                                    order_prod_total_price: '',
                                                    order_prod_user_id: '',
                                                    order_prod_metric_system_id: ''
                                                });
                                            }}
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
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Order Products</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <p className="text-l font-bold mb-4" style={{ marginTop: '20px', marginBottom: '-10px' }}>Order ID</p>
                                        <select
                                            name="order_id"
                                            value={formData.order_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Order</option>
                                            {orders.map((order) => (
                                                <option key={order.order_id} value={order.order_id}>
                                                    {order.order_id}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Product Crop Name</p>
                                        <select
                                            name="order_prod_crop_id"
                                            value={formData.order_prod_crop_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Crop</option>
                                            {crops.map((crop) => (
                                                <option key={crop.crop_id} value={crop.crop_id}>
                                                    {crop.crop_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Total Weight</p>
                                        <input
                                            type="text"
                                            name="order_prod_total_weight"
                                            value={formData.order_prod_total_weight}
                                            onChange={handleInputChange}
                                            placeholder="Order Product Total Weight"
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Total Price</p>
                                        <input
                                            type="text"
                                            name="order_prod_total_price"
                                            value={formData.order_prod_total_price}
                                            onChange={handleInputChange}
                                            placeholder="Order Product Total Price"
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>User</p>
                                        <select
                                            name="order_prod_user_id"
                                            value={formData.order_prod_user_id}
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
                                        <p className="text-l font-bold mb-4" style={{ marginBottom: '-10px' }}>Metric System</p>
                                        <select
                                            name="order_prod_metric_system_id"
                                            value={formData.order_prod_metric_system_id}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Select Metric System</option>
                                            {metricSystems.map((metricSystem) => (
                                                <option key={metricSystem.metric_system_id} value={metricSystem.metric_system_id}>
                                                    {metricSystem.metric_system_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setEditModalOpen(false)}
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
                {deleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this order product?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
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

export default OrderProductsPage;
