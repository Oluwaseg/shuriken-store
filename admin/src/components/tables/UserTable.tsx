import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import EditUserModal from "../modals/EditUser";
import ConfirmDeleteModal from "../modals/DeleteUser";
import PagePreloader from "../../components/PagePreloader";

interface User {
  _id: string;
  avatar: { url: string }[];
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [loading]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>("/api/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUser(null);
    setUserToDelete(null);
  };

  const handleUserUpdated = async () => {
    await fetchUsers();
    toast.success("User updated successfully.");
    handleModalClose();
  };

  const handleUserDeleted = async () => {
    await fetchUsers();
    toast.success("User deleted successfully.");
    handleModalClose();
  };

  if (loading) {
    return <PagePreloader />;
  }

  return (
    <section className="container mx-auto mt-8 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
                            />
                            <span>#</span>
                          </div>
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                          Image
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 ">
                          Name
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                          Email
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                          Role
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 whitespace-pre">
                          Joined On
                        </th>
                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                          Verified
                        </th>
                        <th className="relative py-3.5 px-4">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {users.map((user, index) => (
                        <tr key={user._id}>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-200">
                            <div className="inline-flex items-center gap-x-3">
                              <input
                                type="checkbox"
                                className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700"
                              />
                              <span>{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <img
                              src={
                                user.avatar[0]?.url ||
                                "https://via.placeholder.com/40"
                              }
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-pre">
                            {user.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {user.role}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {user.isVerified ? (
                              <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                <FaCheck className="text-green-500" />
                                <span className="text-sm font-normal">
                                  Verified
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-red-500 bg-red-100/60 dark:bg-gray-800">
                                <FaTimes className="text-red-500" />
                                <span className="text-sm font-normal">
                                  Not Verified
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-6">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser as User}
          onClose={handleModalClose}
          onSuccess={handleUserUpdated}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          user={userToDelete as User}
          onClose={handleModalClose}
          onSuccess={handleUserDeleted}
        />
      )}
    </section>
  );
};

export default UsersTable;
