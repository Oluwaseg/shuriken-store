import { useEffect, useState } from 'react';
import { FaBars, FaBell, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../redux/store';

interface User {
  avatar: { url: string }[];
  name: string;
  role: string;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user as User | null
  );
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );

  // Toggle notifications dropdown
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isProfileOpen) setIsProfileOpen(false); // Close Profile if open
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationOpen) setIsNotificationOpen(false); // Close Notification if open
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#notification-menu') && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
      if (!target.closest('#profile-menu') && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isNotificationOpen, isProfileOpen]);

  return (
    <nav
      className={`bg-white ${
        isDarkMode ? 'dark:bg-gray-800' : 'bg-white'
      } text-gray-800 dark:text-white shadow-md fixed top-0 left-0 right-0 z-10 w-full`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Sidebar toggle button */}
          <div className='flex items-center'>
            <button
              onClick={toggleSidebar}
              className='text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden'
            >
              <FaBars className='h-6 w-6 dark:text-white' />
            </button>
          </div>

          {/* Search bar */}
          <div className='flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end'>
            <div className='max-w-lg w-full lg:max-w-xs'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaSearch className='h-5 w-5 text-gray-400 dark:text-white' />
                </div>
                <input
                  id='search'
                  name='search'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300  dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='Search'
                  type='search'
                />
              </div>
            </div>
          </div>

          {/* Icons section */}
          <div className='flex items-center space-x-4'>
            {/* Notifications */}
            <div className='relative' id='notification-menu'>
              <button
                onClick={toggleNotification}
                className='p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <FaBell className='h-6 w-6 dark:text-white' />
              </button>
              {isNotificationOpen && (
                <div className='absolute right-[-10px] top-[50px] w-72 sm:w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50'>
                  <div className='py-2'>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white px-4 py-2'>
                      Notifications
                    </h3>
                    <div className='divide-y divide-gray-200'>
                      <a href='#' className='block px-4 py-3 hover:bg-gray-100'>
                        <p className='text-sm text-gray-700 dark:text-white'>
                          New message from John Doe
                        </p>
                        <p className='text-xs text-gray-500 dark:text-white mt-1'>
                          3 minutes ago
                        </p>
                      </a>
                      <a href='#' className='block px-4 py-3 hover:bg-gray-100'>
                        <p className='text-sm text-gray-700 dark:text-white'>
                          Your report is ready
                        </p>
                        <p className='text-xs text-gray-500 dark:text-white mt-1'>
                          1 hour ago
                        </p>
                      </a>
                    </div>
                    <a
                      href='#'
                      className='block text-sm font-medium text-indigo-600 px-4 py-2 hover:text-indigo-500'
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className='relative' id='profile-menu'>
              <button
                onClick={toggleProfile}
                className='max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                aria-haspopup='true'
              >
                <img
                  src={user?.avatar[0]?.url || 'https://via.placeholder.com/80'}
                  alt='User Profile'
                  className='h-8 w-8 rounded-full'
                />
              </button>
              {isProfileOpen && (
                <div
                  className='absolute right-2 top-[50px] w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50'
                  role='menu'
                  aria-orientation='vertical'
                >
                  <div className='block px-4 py-2 text-sm text-gray-700 dark:text-white'>
                    <div className='font-semibold'>{user?.name || 'Guest'}</div>
                    <div className='text-xs text-gray-500 dark:text-white'>
                      {user?.role || 'Role'}
                    </div>
                  </div>

                  <NavLink
                    to={'/profile'}
                    className={
                      'block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100'
                    }
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to={'/settings'}
                    className={
                      'block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100'
                    }
                  >
                    Settings
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
