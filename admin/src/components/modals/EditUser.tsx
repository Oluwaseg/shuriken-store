import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [role, setRole] = useState<string>(user.role);

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

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setRole(e.target.value);

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
            onChange={handleNameChange}
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
            onChange={handleEmailChange}
            className="mt-1 block w-full px-3 py-2 border border-secondary focus:ring-secondary focus:outline-tertiary rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={handleRoleChange}
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
