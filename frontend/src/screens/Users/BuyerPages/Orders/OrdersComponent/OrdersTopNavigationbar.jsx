import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersTopNavigationbarItem from './OrdersTopNavigationbarItem';
import { FaList, FaMoneyBill, FaTruck, FaBoxOpen, FaCheck, FaTimes, FaUndoAlt } from 'react-icons/fa';

const OrdersTopNavigationbar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="bg-white shadow fixed top-2 left-12 w-full z-10 mt-14 ml-[250px] border-b border-gray-200 md:w-[calc(100%-250px)]">
            {/* Adjusted width and left margin to fit with sidebar */}
            <div className="flex items-center justify-between p-1 max-w-screen-lg mx-auto">
                <div className="flex space-x-7 md:space-x-8">
                    <OrdersTopNavigationbarItem
                        to="/all"
                        text="All"
                        icon={<FaList />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toPay"
                        text="To Pay"
                        icon={<FaMoneyBill />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toShip"
                        text="To Ship"
                        icon={<FaTruck />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toReceive"
                        text="To Receive"
                        icon={<FaBoxOpen />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/completed"
                        text="Completed"
                        icon={<FaCheck />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/cancelled"
                        text="Cancelled"
                        icon={<FaTimes />}
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/returnOrRefund"
                        text="Return Refund"
                        icon={<FaUndoAlt />}
                        onClick={handleNavigation}
                    />
                </div>
            </div>
        </div>
    );
}

export default OrdersTopNavigationbar;
