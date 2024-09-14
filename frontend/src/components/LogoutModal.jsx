import React from 'react';
import { IoIosClose } from "react-icons/io";

function LogoutModal({ onConfirm, onCancel }) {

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-slate-50 p-5 rounded-lg shadow-lg max-w-md w-full text-black transform transition-all duration-300 scale-95"
        onClick={(e) => e.stopPropagation()} // Prevent the click event from propagating inside the modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-2 align-middle">
          <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Logout</h3>
          <button onClick={onCancel} className="">
            <IoIosClose className="text-4xl" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-gray-600">Are you sure you want to log out? You will be returned to the login screen.</p>

        {/* Modal Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md shadow-sm transition-all"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md shadow-sm transition-all"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
