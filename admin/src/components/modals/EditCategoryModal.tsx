import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../services/apiClient';

interface EditCategoryModalProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  onClose: () => void;
  onSave: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>(category.name);
  const [description, setDescription] = useState<string>(category.description);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.put(`/category/${category.id}`, { name, description });
      toast.success('Category updated successfully!');
      onSave();
      handleClose();
    } catch (error) {
      toast.error('Error updating category. Please try again.');
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
          Edit Category
        </h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Field */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
            >
              Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Enter Category Name'
              className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-accent-light focus:border-accent-light dark:focus:ring-accent-dark dark:focus:border-accent-dark bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark'
            />
          </div>
          {/* Description Field */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
            >
              Description
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter Category Description'
              className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-accent-light focus:border-accent-light dark:focus:ring-accent-dark dark:focus:border-accent-dark bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark'
              rows={4}
            />
          </div>
          {/* Buttons */}
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 bg-border-light dark:bg-border-dark text-text-secondary-light dark:text-text-secondary-dark font-semibold rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-dark-secondary duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-white font-semibold rounded-md shadow-sm hover:bg-button-primary-hover-light dark:hover:bg-button-primary-hover-dark duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
