import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileSidebar from './subSidebar/ProfileSidebar';
import MarketSidebar from './subSidebar/MarketSidebar';
import DashboardSidebar from './subSidebar/DashboardSidebar';
import AnalyticsSidebar from './subSidebar/AnalyticsSidebar';

// Define a mapping for different sidebars based on the path
const sidebarMapping = {
  // Profile Sidebar
  '/profile': <ProfileSidebar />,
  '/admin/profile': <ProfileSidebar />,
  '/seller/profile': <ProfileSidebar />,
  '/buyer/profile': <ProfileSidebar />,
  '/market': <MarketSidebar />,

  // Dashboard Sidebar
  '/admin-dash': <DashboardSidebar />,
  // admin Sidebar
  '/admin/dashboard': <DashboardSidebar />,
  '/admin/reports': <DashboardSidebar />,
  // analyitcs Sidebar
  '/admin/analytics': <AnalyticsSidebar />,
  '/admin/marketAnalytics': <AnalyticsSidebar />,

  '/seller/dashboard': <DashboardSidebar />,
  '/buyer/dashboard': <DashboardSidebar />,

  // Market Sidebar
};

function SubSidebar({ userType }) { // Add userType as a prop
  const location = useLocation(); // Get current path

  // Determine the sidebar component based on the current path
  const currentSidebar = sidebarMapping[location.pathname] || <ProfileSidebar />;

  // Clone the sidebar component and pass userType as a prop if it is ProfileSidebar
  const sidebarWithProps = React.cloneElement(currentSidebar, { userType });

  return (
    <nav className="subsidebar-maincontainer">
      {sidebarWithProps}
    </nav>
  );
}

export default SubSidebar;
