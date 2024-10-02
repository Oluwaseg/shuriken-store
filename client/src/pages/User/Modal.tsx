import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 shadow-lg'>
        <button
          className='absolute top-2 right-2 text-gray-600'
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className='text-xl font-semibold'>Edit Personal Information</h2>
        <div className='mt-4'>
          <input
            type='text'
            placeholder='Enter your name'
            className='border rounded-md p-2 w-full'
          />
        </div>
        <button
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          onClick={onSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
