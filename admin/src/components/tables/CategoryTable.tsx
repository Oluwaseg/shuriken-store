import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditCategoryModal from "../modals/EditCategoryModal";
import DeleteCategoryModal from "../modals/DeleteCategoryModal";

// Type definition for category
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

  return (
    <div className="max-w-7xl mx-auto p-4  dark:bg-transparent">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">
              Description
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold">
              Created At
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-2 text-sm text-gray-900">
                {category.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {category.description}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
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
