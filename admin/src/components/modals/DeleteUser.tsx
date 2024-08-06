import React from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
}

interface ConfirmDeleteModalProps {
  user: User;
  onClose: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  user,
  onClose,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/user/admin/user/${user._id}`);
      onClose();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-lg modal">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete {user.name}?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
