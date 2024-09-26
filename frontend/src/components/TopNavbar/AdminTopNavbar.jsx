import React from 'react';
import { IoNotifications, IoChatboxEllipses } from 'react-icons/io5';
import ProfileDropdown from './TopNavTemplates/ProfileDropdown';

const AdminTopNavbar = ({ unreadCount, unreadNotifCount, hasNewMessage, handleChatClick, toggleNotificationModal, refreshProfile }) => {
    return (
        <nav className="flex items-center justify-between bg-[#eefff4] border-[#00b250] text-[#01a149] z-[1000] px-5 h-12 border-b w-full fixed top-0 left-0 box-border md:h-16">
           <div className="topnav-search-container">
                <input
                    type="text"
                    className="topnav-search-bar"
                    placeholder="Search for Products and Shops....."
                />
            </div>
            <div className="topspacer"></div>
            <div className="topnav-links">
                <div className="topnav-item relative" onClick={toggleNotificationModal}>
                    <span className="topnav-icon-container">
                        <IoNotifications
                            className={`topnav-icon-chat ${unreadNotifCount > 0 ? 'text-red-500' : ''}`}
                        />
                        {unreadNotifCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadNotifCount}
                            </span>
                        )}
                    </span>
                </div>

                <div className="topnav-item relative" onClick={handleChatClick}>
                    <span className="topnav-icon-container">
                        <IoChatboxEllipses
                            className={`topnav-icon-chat ${hasNewMessage}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </span>
                </div>

                <ProfileDropdown key={refreshProfile} />
            </div>
        </nav>
    );
};

export default AdminTopNavbar;
