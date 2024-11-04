// ShopPage.jsx
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MainLogo from '/AgriTayo_Logo_wName.png';

const API_KEY = import.meta.env.VITE_API_KEY;

function ShopsPage() {
    const [shops, setShops] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        shop_id: '',
        shop_name: '',
        shop_address: '',
        latitude: '',
        longitude: '',
        shop_description: '',
        user_id: '',
        image: null,
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleCreateShop = () => {
        setFormData({
            shop_id: '',
            shop_name: '',
            shop_address: '',
            latitude: '',
            longitude: '',
            shop_description: '',
            user_id: '',
            image: null,
        });
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (shop) => {
        setFormData({
            shop_id: shop.shop_id,
            shop_name: shop.shop_name,
            shop_address: shop.shop_address,
            latitude: shop.latitude,
            longitude: shop.longitude,
            shop_description: shop.shop_description,
            user_id: shop.user_id,
            image: null,
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
        formPayload.append('shop_name', formData.shop_name);
        formPayload.append('shop_address', formData.shop_address);
        formPayload.append('latitude', formData.latitude);
        formPayload.append('longitude', formData.longitude);
        formPayload.append('shop_description', formData.shop_description);
        formPayload.append('user_id', formData.user_id);
        if (formData.image) formPayload.append('image', formData.image);

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

    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        const filteredShops = shops.filter((shop) =>
            shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.shop_address.toLowerCase().includes(searchTerm.toLowerCase())
        );

        doc.addImage(MainLogo, 'PNG', 135, 10, 50, 50);
        doc.text("List of Shops", 160, 70, { align: "center" });

        doc.autoTable({
            startY: 80,
            head: [['ID', 'Shop Name', 'Address', 'Latitude', 'Longitude', 'Description', 'User ID']],
            body: filteredShops.map(shop => [
                shop.shop_id,
                shop.shop_name,
                shop.shop_address,
                shop.latitude,
                shop.longitude,
                shop.shop_description,
                shop.user_id,
            ]),
            headStyles: { fillColor: [0, 178, 81] },
        });
        doc.save('shops.pdf');
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-5 text-center text-green-600">Shop Management</h1>
            
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by shop name"
                    className="p-2 border rounded-md w-72"
                />
                <button onClick={exportToPDF} className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md">Export to PDF</button>
                <button onClick={handleCreateShop} className="px-4 py-2 bg-green-600 text-white rounded-md">Add Shop</button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Shop Name</th>
                            <th className="py-2 px-4">Address</th>
                            <th className="py-2 px-4">Latitude</th>
                            <th className="py-2 px-4">Longitude</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">User ID</th>
                            <th className="py-2 px-4">Image</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.filter((shop) => shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase())).map((shop) => (
                            <tr key={shop.shop_id} className="border-b">
                                <td className="py-2 px-4">{shop.shop_id}</td>
                                <td className="py-2 px-4">{shop.shop_name}</td>
                                <td className="py-2 px-4">{shop.shop_address}</td>
                                <td className="py-2 px-4">{shop.latitude}</td>
                                <td className="py-2 px-4">{shop.longitude}</td>
                                <td className="py-2 px-4">{shop.shop_description}</td>
                                <td className="py-2 px-4">{shop.user_id}</td>
                                <td className="py-2 px-4">
                                    {shop.shop_image_url && (
                                        <img src={shop.shop_image_url} alt={shop.shop_name} className="w-20 h-auto" />
                                    )}
                                </td>
                                <td className="py-2 px-4 space-x-2">
                                    <button onClick={() => handleEdit(shop)} className="px-3 py-1 bg-green-600 text-white rounded-md">Edit</button>
                                    <button onClick={() => handleDeleteClick(shop)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Shop' : 'Create Shop'}</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <input type="hidden" name="shop_id" value={formData.shop_id} />
                            <input type="text" name="shop_name" value={formData.shop_name} onChange={handleInputChange} placeholder="Shop Name" required className="w-full mb-2 p-2 border rounded-md" />
                            <input type="text" name="shop_address" value={formData.shop_address} onChange={handleInputChange} placeholder="Shop Address" required className="w-full mb-2 p-2 border rounded-md" />
                            <input type="number" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="Latitude" step="any" required className="w-full mb-2 p-2 border rounded-md" />
                            <input type="number" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="Longitude" step="any" required className="w-full mb-2 p-2 border rounded-md" />
                            <textarea name="shop_description" value={formData.shop_description} onChange={handleInputChange} placeholder="Shop Description" required className="w-full mb-2 p-2 border rounded-md" />
                            <input type="number" name="user_id" value={formData.user_id} onChange={handleInputChange} placeholder="User ID" required className="w-full mb-2 p-2 border rounded-md" />
                            <input type="file" name="image" onChange={handleFileChange} className="w-full mb-4 p-2 border rounded-md" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">{isEdit ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete <strong>{shopToDelete.shop_name}</strong>?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShopsPage;
