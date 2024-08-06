import React, { useState, FormEvent } from "react";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/category/${category.id}`, { name, description });
      toast.success("Category updated successfully!");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Error updating category. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-500 opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md"
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
