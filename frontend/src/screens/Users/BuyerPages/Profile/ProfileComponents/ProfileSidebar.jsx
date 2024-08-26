import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebarItem from './ProfileSidebarItem'; // Adjust the import path as needed

const ProfileSidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="profile-sidebar h-full bg-white fixed mt-10 ml-20">
            <div className="p-4">
                <h2 className="sidebar-title1">My Account</h2>
            </div>
            <ul className="space-y-4">
                <ProfileSidebarItem
                    to="/profile"
                    text="Profile"
                    onClick={handleNavigation}
                />
                <ProfileSidebarItem
                    to="/addresses"
                    text="Addresses"
                    onClick={handleNavigation}
                />
                <ProfileSidebarItem
                    to="/authentication"
                    text="Change Password"
                    onClick={handleNavigation}
                />
                <ProfileSidebarItem
                    to="/deleteAccount"
                    text="Privacy Settings"
                    onClick={handleNavigation}
                />
            </ul>
        </div>
    );
}

export default ProfileSidebar;
