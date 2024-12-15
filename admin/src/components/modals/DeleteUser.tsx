import React from 'react';
import apiClient from '../../services/apiClient';

interface User {
  _id: string;
  name: string;
}

interface ConfirmDeleteModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/user/${user._id}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10]'>
      <div className='bg-body-light dark:bg-body-dark p-6 rounded-lg shadow-lg w-1/3 max-w-lg modal'>
        <h2 className='text-xl font-bold mb-4 dark:text-text-primary-dark'>
          Confirm Delete
        </h2>
        <p className='mb-4 dark:text-text-primary-dark'>
          Are you sure you want to delete {user.name}?
        </p>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 duration-200 dark:bg-opacity-60 text-white px-4 py-2 rounded hover:bg-gray-500'
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className='bg-accent-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark duration-300 text-white px-4 py-2 rounded hover:bg-accent-dark'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
