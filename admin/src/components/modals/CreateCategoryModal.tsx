import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../../services/apiClient';

interface CreateCategoryModalProps {
  onClose: () => void;
  onSave: () => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await apiClient.post('/category', { name, description });
      toast.success('Category created successfully!');
      setName('');
      setDescription('');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error creating category. Please try again.');
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-body-light dark:bg-body-dark p-6 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
          Create Category
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name Input */}
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
              className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-accent-light focus:border-accent-light dark:focus:ring-accent-dark dark:focus:border-accent-dark sm:text-sm bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark placeholder-placeholder-light dark:placeholder-placeholder-dark'
            />
          </div>
          {/* Description Input */}
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
              className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-accent-light focus:border-accent-light dark:focus:ring-accent-dark dark:focus:border-accent-dark sm:text-sm bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark placeholder-placeholder-light dark:placeholder-placeholder-dark'
              rows={4}
            />
          </div>
          {/* Buttons */}
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-border-light text-text-secondary-light font-semibold rounded-md shadow-sm hover:bg-gray-200 dark:bg-border-dark dark:text-text-secondary-dark dark:hover:bg-dark-secondary duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-button-primary-light text-white font-semibold rounded-md shadow-sm hover:bg-button-hover-light dark:bg-button-primary-dark dark:hover:bg-button-hover-dark duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
