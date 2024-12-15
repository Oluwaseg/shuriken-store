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
        toast.error('Error fetching subcategories.');
      }
    };

    fetchSubcategories();
  }, []);

  const handleEditClick = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
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
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className='max-w-7xl mx-auto p-4 dark:bg-body-dark bg-body-light'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
          Subcategories
        </h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className='flex items-center px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-white font-semibold rounded-md shadow-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200'
        >
          <FaPlus className='mr-2' /> Create Subcategory
        </button>
      </div>

      {/* Table Section */}
      <div className='overflow-x-auto rounded-lg border border-border-light dark:border-border-dark'>
        <table className='min-w-full divide-y divide-border-light dark:divide-border-dark'>
          <thead className='bg-accent-light dark:bg-accent-dark text-white'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Description
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap'>
                Created At
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-body-light dark:bg-body-dark divide-y divide-border-light dark:divide-border-dark'>
            {subcategories.map((subcategory) => (
              <tr
                key={subcategory.id}
                className='hover:bg-gray-100 dark:hover:bg-dark-secondary'
              >
                <td className='px-6 py-4 text-sm text-text-primary-light dark:text-text-primary-dark'>
                  {truncateText(subcategory.name, 20)}
                </td>
                <td className='px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {subcategory.category.name}
                </td>
                <td className='px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {truncateText(subcategory.description, 50)}
                </td>
                <td className='px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                  {new Date(subcategory.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 text-sm'>
                  <div className='flex space-x-4'>
                    <button
                      onClick={() => handleEditClick(subcategory)}
                      className='text-accent-light dark:text-accent-dark hover:underline'
                      aria-label='Edit'
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(subcategory)}
                      className='text-red-500 hover:underline'
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

      {/* Modals */}
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
