import React, { useState } from 'react';
import { BsPeopleFill } from 'react-icons/bs';
import {
  FaBox,
  FaCalendar,
  FaChartBar,
  FaChevronDown,
  FaCog,
  FaInbox,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTachometerAlt,
  FaTag,
} from 'react-icons/fa';
import { HiOutlineDatabase } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/authSlice'; // Assuming you have this action
import { toggleDarkMode } from '../../redux/darkModeSlice';
import { AppDispatch, RootState } from '../../redux/store';
import Circle from '../logo/Circle';
import Shuriken from '../logo/Shuriken';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Track which dropdown is open
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  ); // Redux dark mode state

  const toggleTheme = () => {
    dispatch(toggleDarkMode()); // Dispatch toggleDarkMode action
  };

  const links = [
    { label: 'Dashboard', path: '/', icon: FaTachometerAlt },
    { label: 'Analytics', path: '/analytics', icon: FaChartBar },
    { label: 'Customers', path: '/users', icon: BsPeopleFill },
    { label: 'Orders', path: '/orders', icon: HiOutlineDatabase },
    { label: 'Inbox', path: '/inbox', icon: FaInbox },
    { label: 'Calendar', path: '/calendar', icon: FaCalendar },
    { label: 'Settings', path: '/settings', icon: FaCog },
    {
      label: 'Products',
      icon: FaBox,
      subLinks: [
        { label: 'Products', path: '/products' },
        { label: 'Reviews', path: '/products/reviews' },
      ],
    },
    {
      label: 'Categories',
      icon: FaTag,
      subLinks: [
        { label: 'Categories', path: '/categories' },
        { label: 'Subcategories', path: '/subcategories' },
      ],
    },
  ];

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const isSubLinkActive = (subLinks: { path: string }[]) =>
    subLinks.some((subLink) => location.pathname.startsWith(subLink.path));

  const handleLinkClick = () => {
    toggleSidebar();
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login'); // Navigate to login page after successful logout
      })
      .catch((error: { message: string }) => {
        console.error('Logout failed:', error.message);
        // Optionally, show a toast for logout failure
      });
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-[280px] h-screen transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-gray-800 text-gray-800 dark:text-white lg:translate-x-0 lg:static lg:h-auto overflow-y-auto`}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-4'>
          <div className='flex items-center'>
            <div className={`relative w-12 h-12`}>
              <Circle />
              <div className='absolute inset-0 flex items-center justify-center'>
                <Shuriken className='w-1/2 h-1/2 object-contain' />
              </div>
            </div>

            <span className='text-gray-800 dark:text-gray-200 text-2xl font-semibold ml-2 whitespace-nowrap'>
              Admin Panel
            </span>
          </div>
          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            {isDarkMode ? (
              <FaSun className='h-5 w-5 text-yellow-400' />
            ) : (
              <FaMoon className='h-5 w-5 text-gray-500' />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className='mt-4 px-4 space-y-2'>
          {links.map((link) =>
            link.subLinks ? (
              <div key={link.label} className='space-y-1'>
                <div
                  onClick={() => handleDropdownToggle(link.label)}
                  className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors duration-150 cursor-pointer ${
                    isSubLinkActive(link.subLinks) ||
                    openDropdown === link.label
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <div className='flex items-center'>
                    <link.icon className='h-5 w-5' />
                    <span className='mx-3'>{link.label}</span>
                  </div>
                  <FaChevronDown
                    className={`h-4 w-4 transform transition-transform ${
                      openDropdown === link.label ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </div>
                {openDropdown === link.label && (
                  <div className='ml-8 space-y-1'>
                    {link.subLinks.map((subLink) => (
                      <NavLink
                        key={subLink.path}
                        to={subLink.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `block py-2 px-4 rounded-lg transition-colors duration-150 ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                          }`
                        }
                      >
                        {subLink.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                  }`
                }
              >
                <link.icon className='h-5 w-5' />
                <span className='mx-3'>{link.label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div className='sticky bottom-0 w-full border-t border-gray-200 dark:border-gray-700 mt-auto py-4 px-4 bg-white dark:bg-gray-800'>
          <button
            onClick={handleLogout}
            className='flex items-center py-3 px-4 rounded-lg transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
          >
            <FaSignOutAlt className='h-5 w-5' />
            <span className='mx-3'>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
