import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileSidebarItem = ({ to, text, onClick }) => (
    <li className="px-4">
        <button
            onClick={() => onClick(to)}
            className="block py-2 rounded text-black"
        >
            {text}
        </button>
    </li>
);

export default ProfileSidebarItem;
