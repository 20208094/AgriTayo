import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';
import AdminProfileSidebar from './Profile/AdminProfileSidebar';
import BuyerProfileSidebar from './Profile/BuyerProfileSidebar';
import SellerProfileSidebar from './Profile/SellerProfileSidebar';

// ProfileSidebar now receives userType as a prop
const ProfileSidebar = ({ userType }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div>
            {userType === 1 && <AdminProfileSidebar />}
            {userType === 3 && <BuyerProfileSidebar />}
            {userType === 2 && <SellerProfileSidebar />}
        </div>
    );
}

export default ProfileSidebar;
