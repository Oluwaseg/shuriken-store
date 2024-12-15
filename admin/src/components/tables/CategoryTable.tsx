import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import apiClient from '../../services/apiClient';
import CreateCategoryModal from '../modals/CreateCategoryModal';
import DeleteCategoryModal from '../modals/DeleteCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<{ categories: Category[] }>(
          '/category'
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setCreateModalOpen(false);
    setSelectedCategory(null);
  };

  const refreshCategories = async () => {
    try {
      const response = await apiClient.get<{ categories: Category[] }>(
        '/category'
      );
      setCategories(response.data.categories);
    } catch (error) {
      toast.error('Error refreshing categories.');
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className='max-w-7xl mx-auto p-4 dark:bg-transparent'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
          Categories
        </h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className='px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-white font-semibold rounded-md shadow-sm hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-secondary-light dark:focus:ring-accent-secondary-dark'
        >
          <FaPlus className='inline-block mr-2' /> Create Category
        </button>
      </div>

      <div className='overflow-x-auto rounded-lg shadow'>
        <table className='min-w-full bg-body-light dark:bg-dark-light divide-y divide-border-light dark:divide-border-dark'>
          <thead className='bg-accent-light dark:bg-accent-dark text-white'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-semibold uppercase'>
                Name
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold uppercase'>
                Description
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold uppercase'>
                Created At
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold uppercase'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border-light dark:divide-border-dark'>
            {categories.map((category) => (
              <tr
                key={category.id}
                className='hover:bg-input-light dark:hover:bg-dark-secondary'
              >
                <td className='px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark'>
                  {category.name}
                </td>
                <td className='px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {truncateText(category.description, 40)}
                </td>
                <td className='px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className='px-4 py-3 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  <div className='flex space-x-4'>
                    <button
                      onClick={() => handleEditClick(category)}
                      className='text-accent-light dark:text-accent-dark hover:text-accent-secondary-light dark:hover:text-accent-secondary-dark transition-colors'
                      aria-label={`Edit ${category.name}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className='text-red-500 hover:text-red-700 transition-colors'
                      aria-label={`Delete ${category.name}`}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <CreateCategoryModal
          onClose={handleCloseModals}
          onSave={refreshCategories}
        />
      )}

      {isEditModalOpen && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={handleCloseModals}
          onSave={refreshCategories}
        />
      )}

      {isDeleteModalOpen && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          onClose={handleCloseModals}
          onDelete={refreshCategories}
        />
      )}
    </div>
  );
};

export default CategoryTable;
