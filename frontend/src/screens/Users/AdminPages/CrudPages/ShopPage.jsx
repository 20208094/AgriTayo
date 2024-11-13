import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function ShopsPage() {
    const [shops, setShops] = useState([]);
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
            shop.shop_address.toLowerCase().includes(searchTerm.toLowerCase());

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
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-5 text-center text-green-600">Shop Management</h1>
            <div className="flex flex-wrap gap-4 my-4">
                <button onClick={handleCreateShop} className="px-4 py-2 bg-green-600 text-white rounded-md">+ Shop</button>
            </div>

            <div className="mb-4 flex flex-wrap space-x-2">
                {['delivery', 'pickup', 'gcash', 'cod', 'bank'].map(filterKey => (
                    <select
                        key={filterKey}
                        name={filterKey}
                        value={filter[filterKey]}
                        onChange={handleFilterChange}
                        className="p-1 border rounded-md mt-2 md:mt-0"
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
                    placeholder="Search by shop name"
                    className="p-2 border rounded-md w-72"
                />
                <button onClick={exportToPDF} className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md">Export to PDF</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="py-2 px-4 text-xs sm:text-sm">ID</th>
                            <th className="py-2 px-4 text-xs sm:text-sm">Shop Name</th>
                            <th className="py-2 px-4 text-xs sm:text-sm">Address</th>
                            <th className="py-2 px-4 text-xs sm:text-sm">Description</th>
                            <th className="py-2 px-4 text-xs sm:text-sm">User ID</th>
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
                    <tbody>
                        {filteredShops.map((shop) => (
                            <tr key={shop.shop_id}>
                                <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_id}</td>
                                <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_name}</td>
                                <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_address}</td>
                                <td className="border px-4 py-2 text-xs sm:text-sm">{shop.shop_description}</td>
                                <td className="border px-4 py-2 text-xs sm:text-sm">{shop.user_id}</td>
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
                                <td className="border py-2 px-4 space-y-2 text-xs sm:text-sm">
                                    <button onClick={() => handleEdit(shop)} className="flex items-center justify-center px-5 py-1 bg-green-600 text-white rounded-md">Edit</button>
                                    <button onClick={() => handleDeleteClick(shop)} className="flex items-center justify-center px-2.5 py-1 bg-red-500 text-white rounded-md">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-full max-w-lg space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-4 text-green-600">{isEdit ? 'Edit Shop' : 'Add Shop'}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {Object.keys(formData).map((field) => (
                                field !== 'shop_id' && !['shop_image_url', 'bir_image_url'].includes(field) && (
                                    <div key={field} className="flex flex-col">
                                        <label htmlFor={field} className="text-sm font-semibold text-gray-700">{field.replace('_', ' ').toUpperCase()}</label>
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
                                                <span className="ml-2">Check to enable</span> // Optional, or remove
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
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md">
                        <p>Are you sure you want to delete this shop?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShopsPage;
