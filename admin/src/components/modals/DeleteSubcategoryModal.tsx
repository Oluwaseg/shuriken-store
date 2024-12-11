import React from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../services/apiClient';

interface DeleteSubcategoryModalProps {
  subcategory: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onDelete: () => void;
}

const DeleteSubcategoryModal: React.FC<DeleteSubcategoryModalProps> = ({
  subcategory,
  onClose,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/subcategory/${subcategory.id}`);
      toast.success('Subcategory deleted successfully!');
      onDelete();
      onClose();
    } catch (error) {
      toast.error('Error deleting subcategory. Please try again.');
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-2xl font-semibold dark:text-white mb-4'>
          Delete Subcategory
        </h2>
        <p className='text-sm text-gray-700 dark:text-gray-300 mb-4'>
          Are you sure you want to delete the subcategory{' '}
          <span className='font-semibold'>{subcategory.name}</span>? This action
          cannot be undone.
        </p>
        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 duration-200 focus:outline-none'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 duration-200 focus:outline-none'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubcategoryModal;
