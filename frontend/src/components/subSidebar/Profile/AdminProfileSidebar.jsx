import React from 'react';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';
import SubSidebarItem from '../SubSidebarTemplates/SubSidebarItems';
import SubSidebarTitle from '../SubSidebarTemplates/SubSidebarTitle';
import SubSidebarDivider from '../SubSidebarTemplates/SubSidebarDivider';

const AdminProfileSidebar = () => {
    return (
        <div className="subsidebar">
            {/* Title for the Sidebar */}
            <SubSidebarTitle title="Account Settings" />
            
            {/* Sidebar Items */}
            <ul className="subsidebar-links-container">
                <SubSidebarItem
                    to="/admin/profile"
                    text="Profile"
                    icon={FaUser}
                />
                <SubSidebarItem
                    to="/admin/address"
                    text="Addresses"
                    icon={FaMapMarkerAlt}
                />
                <SubSidebarItem
                    to="/admin/change_password"
                    text="Change Password"
                    icon={FaLock}
                />
                <SubSidebarItem
                    to="/admin/delete_account"
                    text="Delete Account"
                    icon={FaShieldAlt}
                />
            </ul>
            <SubSidebarDivider />
        </div>
    );
}

export default AdminProfileSidebar;
