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
import { RiPlantFill } from "react-icons/ri";



function NullSidebar() {

    return (
        <div className="w-full">
            <SidebarItem to="/" icon={RiPlantFill} text="About" />
            <SidebarItem to="/download" icon={FaDownload} text="Download App" />
        </div>
    );
}

export default NullSidebar;
