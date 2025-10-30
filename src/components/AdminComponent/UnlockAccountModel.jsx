import React from 'react';
import { X, LockOpen } from 'lucide-react';

const UnlockAccountModel = ({ isOpen, onClose, userEmail, onConfirm }) => {
  if (!isOpen) return null;

  const handleUnlock = () => {
    console.log('Unlocking account for:', userEmail);
    // Add your API call here
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white dark:bg-[#0f1923] shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center p-6 sm:p-8">
            {/* Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#389cfa]/10 text-[#389cfa]">
              <LockOpen className="w-8 h-8" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#1F2937] dark:text-white text-center pb-2 pt-2">
              Unlock User Account?
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center pb-3 pt-1">
              Are you sure you want to unlock the account for{' '}
              <strong className="text-gray-800 dark:text-gray-200">{userEmail}</strong>? 
              This will allow them to log in again.
            </p>

            {/* Actions */}
            <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex mt-2 sm:mt-0 min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold border border-gray-300 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={handleUnlock}
                className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#389cfa] text-white text-sm font-bold transition-opacity hover:opacity-90"
              >
                <span>Unlock Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnlockAccountModel;
