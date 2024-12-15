import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../services/apiClient';

interface DeleteCategoryModalProps {
  category: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  onClose,
  onDelete,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(true);

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    }
  }, [showModal]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
      onClose();
    }, 300);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/category/${category.id}`);
      toast.success('Category deleted successfully!');
      onDelete();
      handleClose();
    } catch (error) {
      toast.error('Error deleting category. Please try again.');
    }
  };

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-gray-800 dark:bg-black bg-opacity-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-75' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`bg-body-light dark:bg-body-dark p-6 rounded-lg shadow-lg z-10 w-full max-w-md transform transition-transform duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
        }`}
      >
        <h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
          Confirm Delete
        </h3>
        <p className='mb-4 text-text-secondary-light dark:text-text-secondary-dark'>
          Are you sure you want to delete the category{' '}
          <strong className='text-accent-light dark:text-accent-dark'>
            {category.name}
          </strong>
          ?
        </p>
        <div className='flex justify-end space-x-2'>
          {/* Cancel Button */}
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 bg-border-light dark:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark font-semibold rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-dark-secondary duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
          >
            Cancel
          </button>
          {/* Delete Button */}
          <button
            type='button'
            onClick={handleDelete}
            className='px-4 py-2 bg-red-600 dark:bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 dark:hover:bg-red-700 duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
