import React from 'react';

function LogoutModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                <p>Are you sure you want to log out?</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-500 text-white rounded" 
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
