import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg relative w-full 
                   max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl
                   sm:mt-24 sm:ml-6 sm:mr-0 sm:mb-0
                   sm:self-start"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
