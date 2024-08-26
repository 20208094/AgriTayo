import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersTopNavigationbarItem from './OrdersTopNavigationbarItem';

const OrdersTopNavigationbar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="bg-white shadow-md fixed top-0 left-0 w-full z-10 mt-10 ml-20">
            <div className="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
                <div className="flex space-x-4">
                    <OrdersTopNavigationbarItem
                        to="/all"
                        text="All"
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toPay"
                        text="To Pay"
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toShip"
                        text="To Ship"
                        onClick={handleNavigation}
                    />
                    <OrdersTopNavigationbarItem
                        to="/toRecieve"
                        text="To Recieve"
                        onClick={handleNavigation}
                    />
                     <OrdersTopNavigationbarItem
                        to="/completed"
                        text="Completed"
                        onClick={handleNavigation}
                    />
                     <OrdersTopNavigationbarItem
                        to="/cancelled"
                        text="Cancelled"
                        onClick={handleNavigation}
                    />
                     <OrdersTopNavigationbarItem
                        to="/returnOrRefund"
                        text="Return Refund"
                        onClick={handleNavigation}
                    />
                </div>
            </div>
        </div>
    );
}

export default OrdersTopNavigationbar;
