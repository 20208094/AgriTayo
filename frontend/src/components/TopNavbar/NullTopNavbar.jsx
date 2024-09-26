import React from 'react';
import { IoNotifications, IoChatboxEllipses, IoLogIn } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const NullTopNavbar = () => {
    const navigate = useNavigate(); // useNavigate hook for navigation

    const toggleLogin = () => {
        navigate('/login'); // Navigate to /login when the login icon is clicked
    };

    return (
        <nav className="flex items-center justify-between bg-[#eefff4] border-[#00b250] text-[#01a149] z-[1000] px-5 h-12 border-b w-full fixed top-0 left-0 box-border md:h-16">
            <div className="topnav-links absolute inset-y-0 right-0 mr-10">
                <div className="topnav-item relative" onClick={toggleLogin}>
                    <span className="grid grid-cols-2 text-l cursor-pointer">
                        <IoLogIn className='text-2xl' />
                        <p>Login</p>
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default NullTopNavbar;
