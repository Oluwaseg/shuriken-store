import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import PagePreloader from '../../components/PagePreloader';
import apiClient from '../../services/apiClient';
import ConfirmDeleteModal from '../modals/DeleteUser';
import EditUserModal from '../modals/EditUser';

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
      const response = await apiClient.get<{ users: User[] }>('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users', error);
      toast.error('Failed to fetch users.');
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
    toast.success('User updated successfully.');
    handleModalClose();
  };

  const handleUserDeleted = async () => {
    await fetchUsers();
    toast.success('User deleted successfully.');
    handleModalClose();
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
        <PagePreloader />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <Toaster position='top-right' />
      {/* Heading Section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
          User Table
        </h1>
        <button
          className='px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-body-light dark:text-body-dark text-sm font-medium rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark'
          onClick={() =>
            toast('Add user functionality coming soon!', { icon: '🚧' })
          }
        >
          Add User
        </button>
      </div>
      <div className='mt-8'>
        <div className='flex flex-col mt-8'>
          <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-border-light dark:border-border-dark'>
              <table className='min-w-full'>
                <thead>
                  <tr>
                    {[
                      '#',
                      'Image',
                      'Name',
                      'Email',
                      'Role',
                      'Joined On',
                      'Verified',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className='px-6 py-3 border-b border-border-light dark:border-border-dark bg-body-light dark:bg-dark-light text-left text-xs leading-4 font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider'
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-body-light dark:bg-dark-light'>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        <img
                          src={
                            user.avatar[0]?.url ||
                            'https://via.placeholder.com/40'
                          }
                          alt={user.name}
                          className='w-10 h-10 rounded-full object-cover'
                        />
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap border-b border-border-light dark:border-border-dark'>
                        {user.name}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        {user.email}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        {user.role}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        {user.isVerified ? (
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-light text-body-light'>
                            Verified
                          </span>
                        ) : (
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 whitespace-nowrap'>
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-no-wrap border-b border-border-light dark:border-border-dark'>
                        <div className='flex items-center space-x-4'>
                          <button
                            onClick={() => handleEditClick(user)}
                            className='text-accent-light dark:text-accent-dark hover:text-accent-secondary-light dark:hover:text-accent-secondary-dark'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className='text-red-500 hover:text-red-700'
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
    </div>
  );
};

export default UsersTable;
