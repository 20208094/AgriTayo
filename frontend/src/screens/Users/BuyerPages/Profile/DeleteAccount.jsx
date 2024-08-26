import React, { useEffect, useState } from 'react'
import ProfileSidebar from './ProfileComponents/ProfileSidebar';
import Modal from "../../../../components/Modal/Modal";

const API_KEY = import.meta.env.VITE_API_KEY;

function DeleteAccount() {

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredUser, setFilteredUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function fetchUserSession() {
        try {
            const response = await fetch("/api/session", {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("User session data:", data); // Logging user session data
                setUserId(data.user_id);
            } else {
                console.error("Failed to fetch user session:", response.statusText);
            }
        } catch (err) {
            console.error("Error fetching user session:", err.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users", {
                headers: {
                    "x-api-key": API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Fetched users:", data); // Logging users data
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (userId && users.length > 0) {
            const user = users.find((user) => user.user_id === userId);
            console.log("Filtered user:", user); // Logging filtered user data
            setFilteredUser(user);
        }
    }, [userId, users]);

    // for modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div>Loading...</div>
                </div>
            ) : (
                <div className="p-8 ml-72 mt-10">
                    <h1 className="">Delete Account</h1>
                    <button className='' onClick={openModal}>Delete Account</button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
                        <p className=''>Do you really want to delete your account? </p>
                        <button type='button' onClick={closeModal} className=''>
                            Cancel
                        </button>
                        <button className=''>
                            Yes
                        </button>
                    </Modal>
                </div>
            )}
        </>
    )
}

export default DeleteAccount