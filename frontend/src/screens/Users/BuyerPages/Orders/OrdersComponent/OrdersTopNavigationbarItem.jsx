import React from 'react';

const OrdersTopNavigationbarItem = ({ to, text, icon, onClick }) => {
    return (
        <div 
            onClick={() => onClick(to)} 
            className="flex items-center cursor-pointer group hover:text-green-600 transition duration-100 ease-in-out px-5 py-2"
        >
            {/* The 'group' class ensures the icon and text change color together on hover */}
            <span className="mr-2 text-xl group-hover:text-green-600">{icon}</span>
            <span className="font-semibold text-gray-800 group-hover:text-green-600">{text}</span>
        </div>
    );
};

export default OrdersTopNavigationbarItem;
