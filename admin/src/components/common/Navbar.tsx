import { useEffect, useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
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
      className={`bg-body-light dark:bg-body-dark text-text-primary-light dark:text-text-primary-dark shadow-sm fixed top-0 left-0 right-0 z-10 w-full`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Sidebar toggle button */}
          <div className='flex items-center'>
            <button
              onClick={toggleSidebar}
              className='text-text-secondary-light dark:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-light dark:focus:ring-accent-dark lg:hidden'
            >
              <FaBars className='h-6 w-6' />
            </button>
          </div>

          {/* Icons section */}
          <div className='flex items-center space-x-4'>
            {/* Notifications */}
            <div className='relative' id='notification-menu'>
              <button
                onClick={toggleNotification}
                className='p-1 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
              >
                <FaBell className='h-6 w-6' />
              </button>
              {isNotificationOpen && (
                <div className='absolute right-[-10px] top-[50px] w-72 sm:w-80 rounded-md shadow-lg bg-body-light dark:bg-body-dark ring-1 ring-border-light dark:ring-border-dark focus:outline-none z-50'>
                  <div className='py-2'>
                    <h3 className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark px-4 py-2'>
                      Notifications
                    </h3>
                    <div className='divide-y divide-border-light dark:divide-border-dark'>
                      <a
                        href='#'
                        className='block px-4 py-3 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark'
                      >
                        <p className='text-sm'>New message from John Doe</p>
                        <p className='text-xs mt-1'>3 minutes ago</p>
                      </a>
                      <a
                        href='#'
                        className='block px-4 py-3 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark'
                      >
                        <p className='text-sm'>Your report is ready</p>
                        <p className='text-xs mt-1'>1 hour ago</p>
                      </a>
                    </div>
                    <a
                      href='#'
                      className='block text-sm font-medium text-accent-light dark:text-accent-dark px-4 py-2 hover:text-button-hover-light dark:hover:text-button-hover-dark'
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
                className='max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark'
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
                  className='absolute right-2 top-[50px] w-48 rounded-md shadow-lg py-1 bg-body-light dark:bg-body-dark ring-1 ring-border-light dark:ring-border-dark z-50'
                  role='menu'
                  aria-orientation='vertical'
                >
                  <div className='block px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark'>
                    <div className='font-semibold'>{user?.name || 'Guest'}</div>
                    <div className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
                      {user?.role || 'Role'}
                    </div>
                  </div>

                  <NavLink
                    to={'/profile'}
                    className={
                      'block px-4 py-2 text-sm hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark'
                    }
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to={'/settings'}
                    className={
                      'block px-4 py-2 text-sm hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark'
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
