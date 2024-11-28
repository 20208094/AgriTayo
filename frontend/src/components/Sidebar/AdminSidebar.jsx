import React, { useState } from 'react';
import SidebarItem from './SidebarTemplates/SidebarItem';
import DropdownItem from './SidebarTemplates/DropdownItem';
import SidebarTitle from './SidebarTemplates/SidebarTitle';
import { FaShoppingBasket, FaDownload, FaBox, FaUser, FaShoppingCart, FaTag, FaTasks, FaCheckCircle, FaShippingFast, FaClipboardList, FaMoneyBillWave, FaTruck, FaBell } from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import { GiThreeLeaves } from "react-icons/gi";
import { RiSettings3Fill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiUsers } from "react-icons/hi2";
import { FaCartShopping, FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoPricetags } from "react-icons/io5";


function AdminSidebar() {
    const [showDevLinks, setShowDevLinks] = useState(false);

    return (
        <div className="w-full">
            <SidebarItem to="/admin/dashboard" icon={MdSpaceDashboard} text="Dashboard" />
            <SidebarItem to="/admin/download" icon={FaDownload} text="Download App" />

            {/* MARKET ROUTES */}
            <SidebarTitle text="Market" />

            <SidebarItem to="/admin/crop-category" icon={GiThreeLeaves} text="View Market" />

            {/* ANALYTICS ROUTES */}
            <SidebarTitle text="Analytics" />
            <SidebarItem to="/admin/MarketAnalytics" icon={FaShoppingBasket} text="Market Analytics" />
            <SidebarItem to="/admin/salesAnalytics" icon={FaMoneyBillWave} text="Sales Analytics" />
            <SidebarItem to="/admin/newUsersAnalytics" icon={HiUsers} text="Users Analytics" />
            <SidebarItem to="/admin/OrdersAnalytics" icon={FaCartShopping} text="Orders Analytics" />
            {/* <SidebarItem to="/admin/individualCropPriceChangesAnalytics" icon={IoPricetags} text="Price Changes" /> */}
            {/* <SidebarItem to="/admin/profitAnalytics" icon={FaMoneyBillTrendUp} text="Profit Analytics" /> */}

            <SidebarTitle text="Admin" />

            {/* Dev Menu Dropdown */}
            <button
                className="sidebar-item w-full"
                onClick={() => setShowDevLinks(!showDevLinks)}
            >
                <RiSettings3Fill className="sidebar-icon" />
                <span className="sidebar-text">Dev Menu</span>

                <IoMdArrowDropdown
                    className={`${showDevLinks ? 'rotate-180' : 'rotate-0'} dropdown-arrow`}
                />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${showDevLinks ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                <DropdownItem to="/admin/user_type" icon={FaUser} text="User Type" />
                <DropdownItem to="/admin/users" icon={FaUser} text="Users" />
                {/* <DropdownItem to="/admin/addresses" icon={FaBox} text="Addresses" /> */}
                <DropdownItem to="/admin/shops" icon={FaShoppingCart} text="Shops" />
                {/* <DropdownItem to="/admin/carts" icon={FaShoppingCart} text="Cart" /> */}
                {/* <DropdownItem to="/admin/cart_products" icon={FaShoppingCart} text="Cart Products" /> */}
                <DropdownItem to="/admin/crop_category" icon={FaTag} text="Crop Category" />
                <DropdownItem to="/admin/crop_sub_category" icon={FaTag} text="Crop Subcategory" />
                <DropdownItem to="/admin/crop_variety" icon={FaTag} text="Crop Variety" />
                <DropdownItem to="/admin/metric_system" icon={FaTasks} text="Metric System" />
                <DropdownItem to="/admin/crops" icon={FaCheckCircle} text="Crops" />
                {/* <DropdownItem to="/admin/order_status" icon={FaShippingFast} text="Order Status" /> */}
                <DropdownItem to="/admin/orders" icon={FaMoneyBillWave} text="Orders" />
                <DropdownItem to="/admin/order_products" icon={FaClipboardList} text="Order Products" />
                {/* <DropdownItem to="/admin/order_tracking" icon={FaTruck} text="Order Tracking" />
                <DropdownItem to="/admin/payments" icon={FaMoneyBillWave} text="Payments" />
                <DropdownItem to="/admin/notifications" icon={FaBell} text="Notifications" /> */}
                <DropdownItem to="/admin/reviews" icon={FaBell} text="Reviews" />
            </div>
        </div>
    );
}

export default AdminSidebar;
