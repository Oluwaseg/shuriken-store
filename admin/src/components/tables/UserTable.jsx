import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import EditUserModal from "../modals/EditUser";
import ConfirmDeleteModal from "../modals/DeleteUser";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/admin/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUser(null);
    setUserToDelete(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Joined On
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
              <td className="px-4 py-4 text-sm">
                <img
                  src={user.avatar[0]?.url || "https://via.placeholder.com/40"}
                  alt={`${user.name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{user.role}</td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditUserModal user={selectedUser} onClose={handleModalClose} />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal user={userToDelete} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default UsersTable;
