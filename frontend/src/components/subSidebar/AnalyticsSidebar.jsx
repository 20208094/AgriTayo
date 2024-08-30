import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';
import SubSidebarItem from './SubSidebarTemplates/SubSidebarItems';
import BuyerProfileSidebar from './Profile/BuyerProfileSidebar';
import SellerProfileSidebar from './Profile/SellerProfileSidebar';
import SubSidebarTitle from './SubSidebarTemplates/SubSidebarTitle';
import SubSidebarDivider from './SubSidebarTemplates/SubSidebarDivider';
import AdminAnalyticsSidebar from './Analytics/AdminAnalyticsSidebar';

// ProfileSidebar now receives userType as a prop
const AnalyticsSidebar = ({ userType }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className='subsidebar'>
            {/* Dev Routes */}
            <SubSidebarDivider />
            <SubSidebarTitle title="Developer Routes" />
            <ul className="sidebar-menu">
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
                    to="/change_password"
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

            <SubSidebarDivider />
            {/* Render specific sidebar based on userType */}
            {userType === 1 && <AdminAnalyticsSidebar />}
            {userType === 2 && <SellerProfileSidebar />}
            {userType === 3 && <BuyerProfileSidebar />}
        </div>
    );
}

export default AnalyticsSidebar;
