import React from 'react';
import { NavLink } from 'react-router-dom';

const DropdownItem = ({ to, icon: Icon, text, showDropdown, onClick }) => (
  <NavLink to={to} className="dropdown-item" onClick={onClick}>
    <Icon className="sidebar-dropdown-icon" />
    <span className="sidebar-text">{text}</span>
  </NavLink>
);

export default DropdownItem;
