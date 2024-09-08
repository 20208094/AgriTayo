import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';
import SubSidebarItem from '../SubSidebarTemplates/SubSidebarItems';

const BuyerProfileSidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="subsidebar">
            <div className="p-4">
                <h2 className="sidebar-title1">My Account b</h2>
            </div>
            <ul className="sidebar-menu space-y-4">
                <SubSidebarItem
                    to="/profile"
                    text="Profile"
                    icon={FaUser}
                    onClick={handleNavigation}
                />
                <SubSidebarItem
                    to="/addresses"
                    text="Addresses"
                    icon={FaMapMarkerAlt}
                    onClick={handleNavigation}
                />
                <SubSidebarItem
                    to="/buyer/change_password"
                    text="Change Password"
                    icon={FaLock}
                    onClick={handleNavigation}
                />
                <SubSidebarItem
                    to="/deleteAccount"
                    text="Privacy Settings"
                    icon={FaShieldAlt}
                    onClick={handleNavigation}
                />
            </ul>
        </div>
    );
}

export default BuyerProfileSidebar;
