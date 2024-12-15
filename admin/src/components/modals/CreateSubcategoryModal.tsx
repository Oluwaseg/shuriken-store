import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import apiClient from '../../services/apiClient';

interface Category {
  id: string;
  name: string;
}

interface CreateSubcategoryModalProps {
  onClose: () => void;
  onSave: () => void;
}

const CreateSubcategoryModal: React.FC<CreateSubcategoryModalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<{ categories: Category[] }>(
          '/category'
        );
        setCategories(response.data.categories);
      } catch (error) {
        toast.error('Error fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await apiClient.post('/subcategory', {
        name,
        category: selectedCategory,
        description,
      });
      toast.success('Subcategory created successfully!');
      setName('');
      setDescription('');
      setSelectedCategory('');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error creating subcategory. Please try again.');
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-body-light dark:bg-body-dark p-6 rounded-lg shadow-lg max-w-md w-full'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
            Create Subcategory
          </h2>
          <button
            onClick={onClose}
            className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors'
            aria-label='Close modal'
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1'
            >
              Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Enter Subcategory Name'
              className='w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark'
            />
          </div>
          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1'
            >
              Category
            </label>
            <select
              id='category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className='w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark'
            >
              <option value=''>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter Subcategory Description'
              className='w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark'
              rows={4}
            />
          </div>
          <div className='flex justify-end space-x-2 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-button-secondary-light dark:bg-button-secondary-dark text-text-secondary-light dark:text-text-secondary-dark font-semibold rounded-md shadow-sm hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-white font-semibold rounded-md shadow-sm hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark flex items-center'
            >
              <FaPlus className='mr-2' />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubcategoryModal;
