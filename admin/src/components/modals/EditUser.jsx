import React, { useState } from "react";
import axios from "axios";

const EditUserModal = ({ user, onClose }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSave = async () => {
    try {
      await axios.put(`/api/user/admin/user/${user._id}`, {
        name,
        email,
        role,
      });
      onClose();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-lg modal">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-secondary focus:ring-secondary focus:outline-tertiary rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-secondary focus:ring-secondary focus:outline-tertiary rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-secondary focus:ring-secondary focus:outline-tertiary rounded-md shadow-sm"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
