import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
      await axios.put(`/api/category/${category.id}`, { name, description });
      toast.success("Category updated successfully!");
      onSave();
      handleClose();
    } catch (error) {
      toast.error("Error updating category. Please try again.");
    }
  };

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-800 transition-opacity duration-300 ${
          isVisible ? "opacity-75" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10 w-full max-w-md transform transition-transform duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
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
              className="mt-1 block dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
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
              className="mt-1 block dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-red-600 dark:bg-red-600 dark:hover:bg-red-800 text-white font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold rounded-md"
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
