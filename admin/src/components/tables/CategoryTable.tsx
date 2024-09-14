import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import EditCategoryModal from "../modals/EditCategoryModal";
import DeleteCategoryModal from "../modals/DeleteCategoryModal";
import CreateCategoryModal from "../modals/CreateCategoryModal";

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
        const response = await axios.get<{ categories: Category[] }>(
          "/api/category"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
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
      const response = await axios.get<{ categories: Category[] }>(
        "/api/category"
      );
      setCategories(response.data.categories);
    } catch (error) {
      toast.error("Error refreshing categories.");
    }
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div className="max-w-7xl mx-auto p-4  dark:bg-transparent">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-secondary hover:bg-opacity-50 duration-200 focus:outline-none"
        >
          <FaPlus className="inline-block mr-2" /> Create Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold whitespace-nowrap">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-900 dark:border dark:border-gray-700">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white dark:border">
                  {category.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-white dark:border">
                  {truncateText(category.description, 10)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-white dark:border">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-white dark:border">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete"
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
