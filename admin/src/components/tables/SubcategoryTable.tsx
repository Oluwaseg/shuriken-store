import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import apiClient from '../../services/apiClient';
import CreateSubcategoryModal from '../modals/CreateSubcategoryModal';
import DeleteSubcategoryModal from '../modals/DeleteSubcategoryModal';
import EditSubcategoryModal from '../modals/EditSubcategoryModal';

interface Subcategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
}

const SubcategoryTable: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await apiClient.get<{ subcategories: Subcategory[] }>(
          '/subcategories'
        );
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error('Error fetching subcategories', error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleEditClick = (subcategory: Subcategory) => {
    const formattedSubcategory = {
      ...subcategory,
      category: {
        id: subcategory.category.id,
        name: subcategory.category.name,
      },
    };
    setSelectedSubcategory(formattedSubcategory);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setCreateModalOpen(false);
    setSelectedSubcategory(null);
  };

  const refreshSubcategories = async () => {
    try {
      const response = await apiClient.get<{ subcategories: Subcategory[] }>(
        '/subcategories'
      );
      setSubcategories(response.data.subcategories);
    } catch (error) {
      toast.error('Error refreshing subcategories.');
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className='max-w-7xl mx-auto p-4  dark:bg-transparent'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>Subcategories</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className='px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-secondary hover:bg-opacity-50 duration-200 focus:outline-none'
        >
          <FaPlus className='inline-block mr-2' /> Create Subcategory
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 bg-white'>
          <thead className='bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-semibold'>
                Name
              </th>
              <th className='px-4 py-2 text-left text-sm font-semibold'>
                Category
              </th>
              <th className='px-4 py-2 text-left text-sm font-semibold'>
                Description
              </th>
              <th className='px-4 py-2 text-left text-sm font-semibold whitespace-nowrap'>
                Created At
              </th>
              <th className='px-4 py-2 text-left text-sm font-semibold'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-300 dark:bg-gray-900 dark:border dark:border-gray-700'>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id}>
                <td className='px-4 py-2 text-sm text-gray-900 dark:text-white dark:border'>
                  {truncateText(subcategory.name, 10)}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600 dark:text-white dark:border whitespace-nowrap'>
                  {subcategory.category.name}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600 dark:text-white dark:border'>
                  {truncateText(subcategory.description, 10)}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600 dark:text-white dark:border'>
                  {new Date(subcategory.createdAt).toLocaleDateString()}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600 dark:text-white dark:border'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleEditClick(subcategory)}
                      className='text-blue-500 hover:text-blue-700 transition-colors'
                      aria-label='Edit'
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(subcategory)}
                      className='text-red-500 hover:text-red-700 transition-colors'
                      aria-label='Delete'
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
        <CreateSubcategoryModal
          onClose={handleCloseModals}
          onSave={refreshSubcategories}
        />
      )}

      {isEditModalOpen && selectedSubcategory && (
        <EditSubcategoryModal
          subcategory={selectedSubcategory}
          onClose={handleCloseModals}
          onSave={refreshSubcategories}
        />
      )}

      {isDeleteModalOpen && selectedSubcategory && (
        <DeleteSubcategoryModal
          subcategory={selectedSubcategory}
          onClose={handleCloseModals}
          onDelete={refreshSubcategories}
        />
      )}
    </div>
  );
};

export default SubcategoryTable;
