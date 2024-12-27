import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { BsHandbag } from 'react-icons/bs';
import {
  HiOutlineChevronLeft,
  HiOutlineMenuAlt3,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi';
import { IoPersonOutline } from 'react-icons/io5';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { switchTheme } from '../../features/themes/themeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ChatSupportButton from '../lib/ChatSupportButton';
import Circle from '../logo/Circle';
import Shuriken from '../logo/Shuriken';
import CartModal from './CartModal';
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.theme);
  const { cart } = useAppSelector((state) => state.cart);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeSwitch = () => {
    dispatch(switchTheme());
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/', text: 'Home' },
        { to: '/products', text: 'Products' },
        { to: '/blog', text: 'Blog' },
        { to: '/contact', text: 'Contact' },
      ]
    : [
        { to: '/', text: 'Home' },
        { to: '/products', text: 'Products' },
        { to: '/blog', text: 'Blog' },
        { to: '/contact', text: 'Contact' },
      ];

  return (
    <nav className='sticky top-0 z-50 bg-body-light dark:bg-body-dark shadow-md transition-colors duration-300'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <NavLink to='/' className='flex items-center space-x-2'>
          <div className='relative w-12 h-12'>
            <Circle />
            <div className='absolute inset-0 flex items-center justify-center'>
              <Shuriken className='w-1/2 h-1/2 object-contain' />
            </div>
          </div>
          <span className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
            ShopIT
          </span>
        </NavLink>

        <div className='hidden md:flex space-x-6'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-md font-medium ${
                  isActive
                    ? 'text-accent-light dark:text-accent-dark'
                    : 'text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark'
                } transition-colors duration-300`
              }
            >
              {link.text}
            </NavLink>
          ))}
        </div>

        <div className='flex items-center space-x-4'>
          {isAuthenticated ? (
            <div className='relative' ref={dropdownRef}>
              <button
                className='flex items-center space-x-2'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={
                    userInfo?.avatar?.[0]?.url ||
                    'https://via.placeholder.com/40'
                  }
                  alt='User'
                  className='w-8 h-8 rounded-full object-cover'
                />
                <span className='hidden md:inline text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
                  {userInfo?.username}
                </span>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-2 w-48 bg-body-light dark:bg-body-dark rounded-md shadow-lg py-1 z-10'
                  >
                    <NavLink
                      to='/profile'
                      className='block px-4 py-2 text-sm text-text-primary-light hover:bg-input-light dark:text-text-primary-dark dark:hover:bg-input-dark'
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to='/orders'
                      className='block px-4 py-2 text-sm text-text-primary-light hover:bg-input-light dark:text-text-primary-dark dark:hover:bg-input-dark'
                    >
                      My Orders
                    </NavLink>
                    <NavLink
                      to='/settings'
                      className='block px-4 py-2 text-sm text-text-primary-light hover:bg-input-light dark:text-text-primary-dark dark:hover:bg-input-dark'
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-text-primary-light hover:bg-input-light dark:text-text-primary-dark dark:hover:bg-input-dark'
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              to='/login'
              className='text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark transition-colors duration-300'
            >
              <IoPersonOutline size={24} />
            </NavLink>
          )}
          <button
            className='relative text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark transition-colors duration-300'
            onClick={() => setIsCartModalOpen(true)}
          >
            <BsHandbag size={24} />
            <span className='absolute -top-2 -right-2 bg-accent-light dark:bg-accent-dark text-white dark:text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {cart?.items.length || 0}
            </span>
          </button>
          <button
            onClick={handleThemeSwitch}
            className='text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark transition-colors duration-300'
          >
            {theme === 'light' ? (
              <HiOutlineMoon size={24} />
            ) : (
              <HiOutlineSun size={24} />
            )}
          </button>
          <button
            className='md:hidden text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark transition-colors duration-300'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HiOutlineMenuAlt3 size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='fixed inset-y-0 right-0 w-64 bg-body-light dark:bg-body-dark shadow-lg z-50'
          >
            <div className='flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark'>
              <span className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                Menu
              </span>
              <button
                className='text-text-primary-light hover:text-accent-light dark:text-text-primary-dark dark:hover:text-accent-dark'
                onClick={() => setIsMenuOpen(false)}
              >
                <HiOutlineChevronLeft size={24} />
              </button>
            </div>
            <div className='py-4'>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-2 px-4 text-sm ${
                      isActive
                        ? 'text-accent-light bg-input-light dark:text-accent-dark dark:bg-input-dark'
                        : 'text-text-primary-light hover:bg-input-light dark:text-text-primary-dark dark:hover:bg-input-dark'
                    } transition-colors duration-300`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
      {isAuthenticated && <ChatSupportButton />}
    </nav>
  );
};

export default Navbar;
