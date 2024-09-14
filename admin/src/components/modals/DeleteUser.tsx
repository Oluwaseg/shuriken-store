import React from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
}

interface ConfirmDeleteModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/user/${user._id}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 max-w-lg modal">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete {user.name}?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-200  hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 duration-200 dark:bg-opacity-60 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className=" bg-red-600  hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700 dark:bg-opacity-50 duration-300 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
