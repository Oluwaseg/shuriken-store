import React from "react";
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
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/category/${category.id}`);
      toast.success("Category deleted successfully!");
      onDelete();
      onClose();
    } catch (error) {
      toast.error("Error deleting category. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-500 opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-4">
          Are you sure you want to delete the category{" "}
          <strong>{category.name}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
