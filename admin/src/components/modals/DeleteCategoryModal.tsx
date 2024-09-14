import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface DeleteCategoryModalProps {
  category: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  onClose,
  onDelete,
}) => {
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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/category/${category.id}`);
      toast.success("Category deleted successfully!");
      onDelete();
      handleClose();
    } catch (error) {
      toast.error("Error deleting category. Please try again.");
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
        className={`fixed inset-0 bg-gray-700 transition-opacity duration-300 ${
          isVisible ? "opacity-75" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg z-10 w-full max-w-md transform transition-transform duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-4">
          Are you sure you want to delete the category
          <strong>{category.name}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 duration-200 dark:bg-opacity-60 text-white font-semibold rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:bg-opacity-50 duration-300 text-white font-semibold rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
