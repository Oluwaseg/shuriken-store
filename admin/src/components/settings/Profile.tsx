import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
import { getUserDetails, updateUserPassword, updateUserProfile } from './api';
import { UpdatePasswordValues, UpdateProfileValues, User } from './types';

const ProfileSettings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileValues, setProfileValues] = useState<UpdateProfileValues>({
    name: '',
    email: '',
    avatar: null,
  });
  const [passwordValues, setPasswordValues] = useState<UpdatePasswordValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData);
        setProfileValues({
          name: userData.name,
          email: userData.email,
          avatar: null,
        });
      } catch (error) {
        toast.error('Error fetching user details.');
      }
    };

    fetchUser();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const updatedUser = await updateUserProfile(profileValues);
      toast.success('Profile updated successfully!');

      dispatch(
        setAuth({
          user: updatedUser,
          token: localStorage.getItem('token') || '',
        })
      );
    } catch (error) {
      toast.error('Error updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      await updateUserPassword(passwordValues);
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Error updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-body-light dark:bg-body-dark'>
      {user && (
        <>
          <form onSubmit={handleProfileSubmit} className='space-y-6 mb-8'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={profileValues.name}
                onChange={handleProfileChange}
                className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark dark:bg-input-dark dark:text-text-dark rounded-md'
                required
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                value={profileValues.email}
                onChange={handleProfileChange}
                className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark dark:bg-input-dark dark:text-text-dark rounded-md'
                required
              />
            </div>

            <div>
              <label
                htmlFor='avatar'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                Avatar
              </label>
              <input
                id='avatar'
                name='avatar'
                type='file'
                accept='image/*'
                onChange={(e) =>
                  setProfileValues((prev) => ({
                    ...prev,
                    avatar: e.target.files?.[0] || null,
                  }))
                }
                className='mt-1 block w-full'
              />
            </div>

            <button
              type='submit'
              className='px-4 py-2 bg-accent-light hover:bg-accent-light hover:bg-opacity-80 text-white font-semibold rounded-md dark:bg-accent-dark dark:hover:bg-accent-dark dark:hover:bg-opacity-80'
              disabled={profileLoading}
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='currentPassword'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                Current Password
              </label>
              <input
                id='currentPassword'
                name='currentPassword'
                type='password'
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
                className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark dark:bg-input-dark dark:text-text-dark rounded-md'
                required
              />
            </div>

            <div>
              <label
                htmlFor='newPassword'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                New Password
              </label>
              <input
                id='newPassword'
                name='newPassword'
                type='password'
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
                className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark dark:bg-input-dark dark:text-text-dark rounded-md'
                required
              />
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
              >
                Confirm New Password
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={passwordValues.confirmPassword}
                onChange={handlePasswordChange}
                className='mt-1 block w-full px-3 py-2 border border-border-light dark:border-border-dark dark:bg-input-dark dark:text-text-dark rounded-md'
                required
              />
            </div>

            <button
              type='submit'
              className='px-4 py-2 bg-accent-light hover:bg-accent-light hover:bg-opacity-80 cursor-pointer text-white font-semibold rounded-md dark:bg-accent-dark dark:hover:bg-accent-dark dark:hover:bg-opacity-80'
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </>
      )}
      <Toaster position='top-right' />
    </div>
  );
};

export default ProfileSettings;
