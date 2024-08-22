import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="h-full bg-white fixed mt-10">
            <div className="p-4">
                <h2 className="text-2xl font-semibold">My Account</h2>
            </div>
            <ul className="space-y-4">
                <li className="px-4">
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className="block py-2 rounded text-black"
                    >
                        Profile
                    </button>
                </li>
                <li className="px-4">
                    <button
                        onClick={() => handleNavigation('/addresses')}
                        className="block py-2 rounded text-black"
                    >
                        Addresses
                    </button>
                </li>
                <li className="px-4">
                    <button
                        onClick={() => handleNavigation('/changePassword')}
                        className="block py-2 rounded text-black"
                    >
                        Change Password
                    </button>
                </li>
                <li className="px-4">
                    <button
                        onClick={() => handleNavigation('/privacySettings')}
                        className="block py-2 rounded text-black"
                    >
                        Privacy Settings
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default ProfileSidebar;
