import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return(
        <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg relative w-full max-w-lg"
        onClick={e => e.stopPropagation()}
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
    )
}

export default Modal