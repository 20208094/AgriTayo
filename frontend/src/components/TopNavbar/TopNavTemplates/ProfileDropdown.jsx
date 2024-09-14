import React, { useState, useRef, useEffect } from 'react';
import LogoutModal from '../../LogoutModal';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY; // Assuming you're using VITE to manage environment variables

function ProfileDropdown({ passedKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false); // Optionally close the menu when logout is clicked
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/logout');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/session', {
          headers: {
            'x-api-key': API_KEY
          }
        });
        if (response.ok) {
          const data = await response.json();
          const { user_id } = data;
          setUserId(user_id);

          // Fetch all users to filter the current user
          fetchUsers();
        } else {
          console.error('Failed to fetch user session:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUserSession();

    // Add event listener to detect clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId && users.length > 0) {
      const user = users.find(user => user.user_id === userId);
      if (user && user.user_image_url) {
        setUserImageUrl(user.user_image_url);
      }
    }
  }, [userId, users]);

  return (
    <div className="relative ml-3">
      <div>
        <button
          onClick={handleToggle}
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <img
            alt="User Avatar"
            src={userImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            className="h-8 w-8 rounded-full"
          />
        </button>
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-emerald-100 py-1 shadow-lg ring-1 ring-[#00b251] ring-opacity-5 transition"
          role="menu"
          aria-orientation="vertical"
        >
          <a
            href="/admin/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00b251]"
            role="menuitem"
          >
            Your Profile
          </a>
          <button
            onClick={handleLogoutClick}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00b251] text-left"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;
