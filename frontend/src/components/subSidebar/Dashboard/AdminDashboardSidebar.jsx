import React from 'react';
import { FaUser, FaMapMarkerAlt, FaLock, FaShieldAlt, } from 'react-icons/fa';
import SubSidebarItem from '../SubSidebarTemplates/SubSidebarItems';
import SubSidebarTitle from '../SubSidebarTemplates/SubSidebarTitle';
import SubSidebarDivider from '../SubSidebarTemplates/SubSidebarDivider';
import { MdDashboard } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";

const AdminDashboardSidebar = () => {
    return (
        <div className="subsidebar">
            {/* Title for the Sidebar */}
            <SubSidebarTitle title="Admin Dashboard" />
            
            {/* Sidebar Items */}
            <ul className="subsidebar-links-container">
                <SubSidebarItem
                    to="/admin/dashboard"
                    text="Dashboard"
                    icon={MdDashboard}
                />
                <SubSidebarItem
                    to="/admin/analytics"
                    text="Analytics"
                    icon={IoAnalyticsSharp}
                />
                <SubSidebarItem
                    to="/admin/reports"
                    text="Reports"
                    icon={TbReportSearch}
                />
            </ul>
            <SubSidebarDivider />
        </div>
    );
}

export default AdminDashboardSidebar;
