import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function ShopsPage() {
    const [shops, setShops] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({
        delivery: '',
        pickup: '',
        gcash: '',
        cod: '',
        bank: '',
        submitLater: ''
    });
    const [formData, setFormData] = useState({
        shop_id: '',
        shop_name: '',
        shop_address: '',
        shop_description: '',
        user_id: '',
        shop_image_url: null,
        delivery: false,
        pickup: false,
        delivery_price: '',
        pickup_price: '',
        gcash: false,
        cod: false,
        bank: false,
        shop_number: '',
        submit_later: false,
        tin_number: '',
        bir_image_url: null,
        pickup_address: '',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [shopToDelete, setShopToDelete] = useState(null);

    useEffect(() => {
        fetchShops();
        fetchUsers();
    }, []);

    const fetchShops = async () => {
        try {
            const response = await fetch('/api/shops', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'x-api-key': API_KEY,
                },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleCreateShop = () => {
        setFormData({
            shop_id: '',
            shop_name: '',
            shop_address: '',
            shop_description: '',
            user_id: '',
            shop_image_url: null,
            delivery: false,
            pickup: false,
            delivery_price: '',
            pickup_price: '',
            gcash: false,
            cod: false,
            bank: false,
            shop_number: '',
            submit_later: false,
            tin_number: '',
            bir_image_url: null,
            pickup_address: '',
        });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (shop) => {
        setFormData({
            shop_id: shop.shop_id,
            shop_name: shop.shop_name,
            shop_address: shop.shop_address,
            shop_description: shop.shop_description,
            user_id: shop.user_id,
            shop_image_url: shop.shop_image_url,
            delivery: shop.delivery,
            pickup: shop.pickup,
            delivery_price: shop.delivery_price,
            pickup_price: shop.pickup_price,
            gcash: shop.gcash,
            cod: shop.cod,
            bank: shop.bank,
            shop_number: shop.shop_number,
            submit_later: shop.submit_later,
            tin_number: shop.tin_number,
            bir_image_url: shop.bir_image_url,
            pickup_address: shop.pickup_address,
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (shop) => {
        setShopToDelete(shop);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEdit ? `/api/shops/${formData.shop_id}` : '/api/shops';
        const method = isEdit ? 'PUT' : 'POST';

        const formPayload = new FormData();
        for (const key in formData) {
            formPayload.append(key, formData[key]);
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'x-api-key': API_KEY },
                body: formPayload,
            });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchShops();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/shops/${shopToDelete.shop_id}`, {
                method: 'DELETE',
                headers: { 'x-api-key': API_KEY },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchShops();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting shop:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const filteredShops = shops.filter((shop) => {
        const matchesDelivery = filter.delivery === '' || (filter.delivery === 'Yes' && shop.delivery) || (filter.delivery === 'No' && !shop.delivery);
        const matchesPickup = filter.pickup === '' || (filter.pickup === 'Yes' && shop.pickup) || (filter.pickup === 'No' && !shop.pickup);
        const matchesGcash = filter.gcash === '' || (filter.gcash === 'Yes' && shop.gcash) || (filter.gcash === 'No' && !shop.gcash);
        const matchesCod = filter.cod === '' || (filter.cod === 'Yes' && shop.cod) || (filter.cod === 'No' && !shop.cod);
        const matchesBank = filter.bank === '' || (filter.bank === 'Yes' && shop.bank) || (filter.bank === 'No' && !shop.bank);
      
        const matchesSearch = shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (() => {
                const user = users.find(user => user.user_id === shop.user_id);
                if (user) {
                    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
                    return fullName.includes(searchTerm.toLowerCase());
                }
                return false;
            })();

        return matchesDelivery && matchesPickup && matchesGcash && matchesCod && matchesBank && matchesSearch;
    });

    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        doc.addImage(MainLogo, 'PNG', 135, 10, 50, 50);
        doc.text("List of Shops", 160, 70, { align: "center" });
        doc.autoTable({
            startY: 80,
            head: [['ID', 'Shop Name', 'Address', 'Description', 'User ID', 'Delivery', 'Pickup', 'Delivery Price', 'Pickup Price', 'GCash', 'COD', 'Bank', 'Shop Number', 'TIN Number', 'Pickup Address']],
            body: filteredShops.map(shop => [
                shop.shop_id,
                shop.shop_name,
                shop.shop_address,
                shop.shop_description,
                shop.user_id,
                shop.delivery ? 'Yes' : 'No',
                shop.pickup ? 'Yes' : 'No',
                shop.delivery_price,
                shop.pickup_price,
                shop.gcash ? 'Yes' : 'No',
                shop.cod ? 'Yes' : 'No',
                shop.bank ? 'Yes' : 'No',
                shop.shop_number,
               
                shop.tin_number,
                shop.pickup_address,
            ]),
            headStyles: { fillColor: [0, 178, 81] },
        });
        doc.save('filtered_shops.pdf');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white drop-shadow-md mb-2">
                                Shop Management
                            </h1>
                            <p className="text-white/80 text-lg font-medium">
                                Manage and organize shop information
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                <span className="text-white font-medium">
                                    {filteredShops.length} Shops
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleCreateShop}
                            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                                hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            + Add Shop
                        </button>

                        <button
                            onClick={exportToPDF}
                            className="bg-white/90 backdrop-blur-sm text-green-600 font-semibold py-2 px-4 rounded-xl
                                hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Export PDF
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {['delivery', 'pickup', 'gcash', 'cod', 'bank'].map(filterKey => (
                            <select
                                key={filterKey}
                                name={filterKey}
                                value={filter[filterKey]}
                                onChange={handleFilterChange}
                                className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                                    focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
                            >
                                <option value="">{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        ))}

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search shops..."
                            className="bg-white/90 backdrop-blur-sm border-0 rounded-xl p-2
                                focus:ring-2 focus:ring-white/50 transition-all duration-200 shadow-lg w-full"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-600 text-white">
                            <tr className="bg-green-600 text-white">
                                <th className="py-2 px-4 text-xs sm:text-sm">ID</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Shop Name</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Address</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Description</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">User</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Delivery</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Pickup</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Delivery Price</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Pickup Price</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">GCash</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">COD</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Bank</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Shop Number</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">TIN Number</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Pickup Address</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">BIR Image</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Shop Image</th>
                                <th className="py-2 px-4 text-xs sm:text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredShops.map((shop) => (
                                <tr key={shop.shop_id} className="hover:bg-white/50 transition-colors duration-150">
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_id}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_name}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_address}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_description}</td>
                                    <td className="p-2">
                                        {(() => {
                                            const user = users.find(user => user.user_id === shop.user_id);
                                            return user ? `${user.firstname} ${user.lastname}` : 'N/A';
                                        })()}
                                    </td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.delivery ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.pickup ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.delivery_price}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.pickup_price}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.gcash ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.cod ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.bank ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_number}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.tin_number}</td>
                                    <td className="border px-4 py-2 text-xs sm:text-sm">{shop.pickup_address}</td>
                                    <td className="border py-2 px-4 text-xs sm:text-sm">
                                        {shop.bir_image_url && (
                                            <img src={shop.bir_image_url} alt={shop.shop_name} className="w-20 h-auto" />
                                        )}
                                    </td>
                                    <td className="border py-2 px-4 text-xs sm:text-sm">
                                        {shop.shop_image_url && (
                                            <img src={shop.shop_image_url} alt={shop.shop_name} className="w-20 h-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(shop)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700
                                                    transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(shop)}
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

                {/* Modal Styling Updates */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {isEdit ? 'Edit Shop' : 'Add Shop'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        {Object.keys(formData).map((field) => (
                                            field !== 'shop_id' && !['shop_image_url', 'bir_image_url'].includes(field) && (
                                                <div key={field} className="flex flex-col">
                                                    <label htmlFor={field} className="text-sm font-semibold text-gray-700">
                                                        {field.replace('_', ' ').toUpperCase()}
                                                    </label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type={typeof formData[field] === 'boolean' ? 'checkbox' : 'text'}
                                                            name={field}
                                                            value={formData[field] || ''}
                                                            onChange={handleInputChange}
                                                            className="p-2 border rounded-md"
                                                            checked={typeof formData[field] === 'boolean' ? formData[field] : undefined}
                                                        />
                                                        {typeof formData[field] === 'boolean' && (
                                                            <span className="ml-2">Check to enable</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                
                                        <div className="flex flex-col col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Shop Image</label>
                                            <input
                                                type="file"
                                                name="shop_image_url"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="p-2 border rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">BIR Image</label>
                                            <input
                                                type="file"
                                                name="bir_image_url"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">{isEdit ? 'Save' : 'Create'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal Update */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm m-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this shop?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
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
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShopsPage;
