import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface EditSubcategoryModalProps {
  subcategory: {
    id: string;
    name: string;
    description: string;
    category: {
      id: string;
      name: string;
    };
  };
  onClose: () => void;
  onSave: () => void;
}

const EditSubcategoryModal: React.FC<EditSubcategoryModalProps> = ({
  subcategory,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>(subcategory.name);
  const [description, setDescription] = useState<string>(
    subcategory.description
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    subcategory.category.id
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ categories: Category[] }>(
          "/api/category"
        );
        setCategories(response.data.categories);
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`/api/subcategory/${subcategory.id}`, {
        name,
        category: selectedCategory,
        description,
      });
      toast.success("Subcategory updated successfully!");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Error updating subcategory. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold dark:text-white mb-4">
          Edit Subcategory
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter Subcategory Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-primary dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Subcategory Description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-primary dark:bg-gray-800 dark:text-white"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 duration-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-secondary hover:bg-opacity-50 duration-200 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubcategoryModal;
