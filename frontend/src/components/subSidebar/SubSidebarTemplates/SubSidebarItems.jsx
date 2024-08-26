import React from 'react';
import { NavLink } from 'react-router-dom';

const SubSidebarItem = ({ to, icon: Icon, text }) => (
    <li className="subsidebar-links">
        <NavLink
            to={to}
            className={({ isActive }) =>
                `sub-sidebar-item ${isActive ? 'sub-sidebar-item-active' : ''}`
            }
        >
            <Icon className="subsidebar-icon" />
            <span>{text}</span>
        </NavLink>
    </li>
);

export default SubSidebarItem;
