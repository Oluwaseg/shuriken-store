import React from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
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
      <div className='bg-body-light dark:bg-body-dark p-6 rounded-lg shadow-lg max-w-md w-full'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
            Delete Subcategory
          </h2>
          <button
            onClick={onClose}
            className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors'
            aria-label='Close modal'
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6'>
          Are you sure you want to delete the subcategory{' '}
          <span className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
            {subcategory.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 bg-button-secondary-light dark:bg-button-secondary-dark text-text-secondary-light dark:text-text-secondary-dark font-semibold rounded-md shadow-sm hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center'
          >
            <FaTrash className='mr-2' />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubcategoryModal;
