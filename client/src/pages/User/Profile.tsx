import { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { useAppSelector } from '../../hooks';
import { Modal } from './Modal';

const Profile = () => {
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!userInfo) return null;
  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleSaveChanges = () => {
    // Dispatch an action to save changes
    // dispatch(/* your action here */);
    handleCloseModal();
  };

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      {/* Header */}
      <header className='bg-white shadow-lg rounded-lg p-6 mb-8'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <img
              src={
                userInfo?.avatar?.[0]?.url || 'https://via.placeholder.com/40'
              }
              alt='Profile'
              className='w-24 h-24 rounded-full shadow-md object-cover'
            />
            <div className='relative'>
              <h1 className='text-2xl font-bold text-gray-800'>
                {userInfo.name}
              </h1>
            </div>
          </div>
          <button
            className='mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700'
            onClick={handleEditClick}
          >
            Edit Profile
          </button>
        </div>
      </header>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>
              Personal Information
            </h2>
            <FaPen
              className='text-gray-600 cursor-pointer hover:text-gray-800'
              onClick={handleEditClick}
            />
          </div>
          <p className='text-gray-600'>Name: {userInfo.name}</p>
          <p className='text-gray-600'>Email: {userInfo.email}</p>
          <p className='text-gray-600'>Username: {userInfo.username}</p>
          <p className='text-gray-600'>Location: Lagos, Nigeria</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>
            Membership
          </h2>
          <p className='text-gray-600'>Status: {userInfo.role}</p>
          <p className='text-gray-600'>
            Joined: {new Date(userInfo.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Order History */}
      <section className='mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>
            Order History
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Sample order card */}
            <div className='bg-gray-50 p-4 rounded-lg shadow-md'>
              <h3 className='font-bold text-lg'>Order #1234</h3>
              <p className='text-sm text-gray-600'>
                Placed on 24th September 2024
              </p>
              <button className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
                View Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist */}
      <section className='mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800'>Wishlist</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
            {/* Sample Wishlist Item */}
            <div className='bg-gray-50 p-4 rounded-lg shadow-md'>
              <img
                src='product-image-url'
                alt='Product'
                className='w-full h-32 object-cover rounded-lg'
              />
              <h3 className='font-semibold text-gray-800 mt-2'>Product Name</h3>
              <p className='text-gray-600'>$99.99</p>
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default Profile;
