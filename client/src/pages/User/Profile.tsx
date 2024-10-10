import { useState } from 'react';
import {
  FaCamera,
  FaCloudUploadAlt,
  FaDribbble,
  FaEdit,
  FaFacebookF,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa';
import {
  fetchUpdateProfile,
  fetchUserDetails,
} from '../../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userInfo?.avatar?.[0]?.url || 'https://via.placeholder.com/120'
  );
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('avatar', image);
    setLoading(true);
    await dispatch(fetchUpdateProfile(formData));
    dispatch(fetchUserDetails());
    setLoading(false);
  };

  return (
    <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 min-h-screen p-6'>
      {/* Main container for profile */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Left Section (Profile & Language) */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          {/* Profile Card */}
          <div className='flex flex-col items-center bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg relative'>
            {/* Nested div for image and upload */}
            <div className='relative'>
              <img
                src={imagePreview || 'https://via.placeholder.com/120'}
                alt='Profile'
                className='w-32 h-32 rounded-full mb-4 shadow-md transition-opacity duration-300 ease-in-out hover:opacity-75'
              />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                id='imageUpload'
              />
              <label
                htmlFor='imageUpload'
                className='absolute inset-0 bottom-4 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300'
              >
                <FaEdit className='mr-1' />
                Edit
              </label>
            </div>
            <h1 className='text-xl font-bold mb-2 dark:text-white'>
              {userInfo.name}
            </h1>
            <p className='mb-4 dark:text-white'>{userInfo.username}</p>

            <button
              onClick={handleSaveImage}
              disabled={loading || !image}
              className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-opacity duration-300 ${
                loading || !image ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className='flex items-center'>
                  <div className='submit-spinner mr-2'></div>
                  Updating...
                </div>
              ) : image ? (
                <>
                  Upload Image
                  <FaCloudUploadAlt className='ml-2' />
                </>
              ) : (
                <>
                  <FaCamera className='mr-2' />
                  Change Picture
                </>
              )}
            </button>
          </div>

          {/* Language & Time */}
          <div className='bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-semibold mb-6'>Language & Time</h2>
            <label className='block text-sm mb-2' htmlFor='language'>
              Select Language
            </label>
            <select
              id='language'
              className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
            >
              <option>English (US)</option>
              <option>French</option>
            </select>

            <label className='block text-sm mt-6 mb-2' htmlFor='timezone'>
              Time Zone
            </label>
            <select
              id='timezone'
              className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
            >
              <option>GMT+0 Greenwich Mean Time</option>
              <option>GMT+1 Central European Time</option>
            </select>

            <button className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-8'>
              Save all
            </button>
          </div>
        </div>

        {/* Middle Section - General Information */}
        <div className='lg:col-span-2 bg-gray-200 dark:bg-gray-700 p-8 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold mb-6'>General Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm mb-2' htmlFor='firstName'>
                First Name
              </label>
              <input
                type='text'
                id='firstName'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., Bonnie'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='lastName'>
                Last Name
              </label>
              <input
                type='text'
                id='lastName'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., Green'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='username'>
                Username
              </label>
              <input
                type='text'
                id='username'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='Enter username'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='email'>
                Email
              </label>
              <input
                type='email'
                id='email'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='example@company.com'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='bio'>
                Bio
              </label>
              <textarea
                id='bio'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='birthday'>
                Birthday
              </label>
              <input
                type='date'
                id='birthday'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='address'>
                Address
              </label>
              <input
                type='text'
                id='address'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., 123 Main St'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='city'>
                City
              </label>
              <input
                type='text'
                id='city'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., San Francisco'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='state'>
                State
              </label>
              <input
                type='text'
                id='state'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., California'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='country'>
                Country
              </label>
              <input
                type='text'
                id='country'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., United States'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='phoneNo'>
                Phone Number
              </label>
              <input
                type='text'
                id='phoneNo'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='e.g., 123-456-7890'
              />
            </div>
            <div>
              <label className='block text-sm mb-2' htmlFor='postalCode'>
                Zip/Postal Code
              </label>
              <input
                type='text'
                id='postalCode'
                className='w-full p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                placeholder='123456'
              />
            </div>
          </div>
          <button className='bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-6'>
            Save all
          </button>
        </div>

        {/* Right Section - Social & Password Info */}
        <div className='lg:col-span-1 flex flex-col gap-6'>
          {/* Profile Card */}
          <div className=' items-center'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
              <h3 className='text-lg font-semibold mb-4'>Social Accounts</h3>
              <ul className='space-y-4'>
                <li className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <FaFacebookF className='mr-2' />
                    <span>Facebook</span>
                  </div>
                  <button className='text-blue-600'>Connect</button>
                </li>
                <li className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <FaTwitter className='mr-2' />
                    <span>Twitter</span>
                  </div>
                  <button className='text-blue-600'>Disconnect</button>
                </li>
                <li className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <FaGithub className='mr-2' />
                    <span>Github</span>
                  </div>
                  <button className='text-blue-600'>Connect</button>
                </li>
                <li className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <FaDribbble className='mr-2' />
                    <span>Dribbble</span>
                  </div>
                  <button className='text-blue-600'>Connect</button>
                </li>
              </ul>
              <button className='mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'>
                Save all
              </button>
            </div>
          </div>
        </div>

        <div className='lg:col-span-2 bg-gray-200 dark:bg-gray-700 p-8 rounded-lg shadow-lg'>
          {/* Password Information */}
          <h3 className='text-lg font-semibold mb-4'>Password Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='mb-4'>
              <label className='block text-sm mb-2' htmlFor='password'>
                Current Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                className='bg-gray-100 dark:bg-gray-700 p-2 rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm mb-2' htmlFor='password'>
                New Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                className='bg-gray-100 dark:bg-gray-700 p-2 rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm mb-2' htmlFor='password'>
                Confirm Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                className='bg-gray-100 dark:bg-gray-700 p-2 rounded'
              />
            </div>
          </div>
          <div className='mt-4 text-gray-500 dark:text-gray-400'>
            <p>Password requirements:</p>
            <ul className='list-disc ml-6'>
              <li>At least 10 characters</li>
              <li>At least one lowercase character</li>
              <li>Inclusion of at least one special character</li>
            </ul>
          </div>
          <button className='mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md'>
            Save all
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
