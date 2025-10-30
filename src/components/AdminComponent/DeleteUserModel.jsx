import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteUserModel = ({ isOpen, onClose, userName, onConfirm }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    console.log('Deleting user:', userName);
    // Add your API call here
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-[#0f1923] shadow-xl ring-1 ring-black/10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8">
            {/* Warning Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#181112] dark:text-white text-center pb-2">
              Confirm Deletion
            </h1>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 text-center pb-6">
              You are about to permanently delete the user account for{' '}
              <strong className="text-gray-800 dark:text-gray-200">{userName}</strong>. 
              This action is irreversible and cannot be undone.
            </p>

            {/* Button Group */}
            <div className="flex w-full flex-col sm:flex-row-reverse gap-3">
              <button
                onClick={handleDelete}
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-red-600 text-white text-base font-bold transition-colors hover:bg-red-700"
              >
                <span>Delete Account</span>
              </button>
              <button
                onClick={onClose}
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-base font-bold transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUserModel;
