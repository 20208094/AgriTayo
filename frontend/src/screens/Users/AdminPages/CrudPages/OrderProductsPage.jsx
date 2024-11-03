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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
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
        setIsEdit(true);
        setEditModalOpen(true);
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
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-semibold mb-6 text-center text-[#00B251]">Order Products Management</h1>

            <form onSubmit={handleSubmit} className="mb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <input
                        type="text"
                        name="order_prod_total_weight"
                        value={formData.order_prod_total_weight}
                        onChange={handleInputChange}
                        placeholder="Order Product Total Weight"
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="order_prod_total_price"
                        value={formData.order_prod_total_price}
                        onChange={handleInputChange}
                        placeholder="Order Product Total Price"
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
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
                <button type="submit" className="bg-green-600 text-white p-2 rounded mt-4">{isEdit ? 'Update' : 'Create'}</button>
            </form>

            <div className="flex mb-5">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 border border-gray-300 rounded mr-2"
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
                    className="p-2 border border-gray-300 rounded mr-2"
                />
                <button onClick={exportToPDF} className="bg-green-600 text-white p-2 rounded">Export to PDF</button>
            </div>

            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Order ID</th>
                        <th className="border border-gray-300 p-2">Product Crop Name</th>
                        <th className="border border-gray-300 p-2">Total Weight</th>
                        <th className="border border-gray-300 p-2">Total Price</th>
                        <th className="border border-gray-300 p-2">User Name</th>
                        <th className="border border-gray-300 p-2">Metric System Name</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrderProducts.map((orderProduct) => (
                        <tr key={orderProduct.order_prod_id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{orderProduct.order_prod_id}</td>
                            <td className="border border-gray-300 p-2">{orderProduct.order_id}</td>
                            <td className="border border-gray-300 p-2">{crops.find(crop => crop.crop_id === orderProduct.order_prod_crop_id)?.crop_name}</td>
                            <td className="border border-gray-300 p-2">{orderProduct.order_prod_total_weight}</td>
                            <td className="border border-gray-300 p-2">{orderProduct.order_prod_total_price}</td>
                            <td className="border border-gray-300 p-2">{users.find(user => user.user_id === orderProduct.order_prod_user_id)?.firstname} {users.find(user => user.user_id === orderProduct.order_prod_user_id)?.lastname}</td>
                            <td className="border border-gray-300 p-2">{metricSystems.find(metricSystem => metricSystem.metric_system_id === orderProduct.order_prod_metric_system_id)?.metric_system_name}</td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => handleEdit(orderProduct)} className="bg-green-600 text-white p-2 rounded mr-2">Edit</button>
                                <button onClick={() => { setDeleteId(orderProduct.order_prod_id); setDeleteModalOpen(true); }} className="bg-red-500 text-white p-2 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Order Product</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
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
                                <input
                                    type="text"
                                    name="order_prod_total_weight"
                                    value={formData.order_prod_total_weight}
                                    onChange={handleInputChange}
                                    placeholder="Order Product Total Weight"
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    name="order_prod_total_price"
                                    value={formData.order_prod_total_price}
                                    onChange={handleInputChange}
                                    placeholder="Order Product Total Price"
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
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
                            <div className="flex justify-end mt-4">
                                <button type="button" onClick={resetForm} className="bg-gray-400 text-white p-2 rounded mr-2">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white p-2 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Delete Order Product</h2>
                        <p>Are you sure you want to delete this order product?</p>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={() => setDeleteModalOpen(false)} className="bg-gray-400 text-white p-2 rounded mr-2">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderProductsPage;
