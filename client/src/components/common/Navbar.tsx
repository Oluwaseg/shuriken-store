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
import Circle from '../logo/Circle';
import Shuriken from '../logo/Shuriken';
import CartModal from './CartModal';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.theme);
  const { cart } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
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
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const unauthenticatedNavLinks = [
    { to: '/', text: 'Home' },
    { to: '/products', text: 'Products' },
    { to: '/blog', text: 'Blog' },
    { to: '/contact', text: 'Contact' },
  ];

  const authenticatedNavLinks = [
    { to: '/home', text: 'Home' },
    { to: '/products', text: 'Products' },
    { to: '/blog', text: 'Blog' },
    { to: '/contact', text: 'Contact' },
  ];

  const navLinks = isAuthenticated
    ? authenticatedNavLinks
    : unauthenticatedNavLinks;

  return (
    <nav className='my-2 px-2 sm:px-4 dark:bg-body-dark bg-body-light w-full left-0 z-50'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        <NavLink
          to='/'
          className='text-xl font-semibold text-accent-light dark:text-accent-dark flex items-center'
        >
          <div className='flex items-center justify-center gap-2.5 font-medium mx-auto'>
            <div className='relative w-12 h-12'>
              <Circle />
              <div className='absolute inset-0 flex items-center justify-center'>
                <Shuriken className='w-1/2 h-1/2 object-contain' />
              </div>
            </div>
            <h1>ShopIT</h1>
          </div>
        </NavLink>

        <div className='hidden md:flex space-x-4'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className='flex flex-col items-center gap-1 text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark duration-300'
            >
              {({ isActive }) => (
                <>
                  {link.text}
                  {isActive && (
                    <hr className='w-2/4 border-none h-[1.5px] bg-accent-light dark:bg-accent-dark' />
                  )}
                </>
              )}
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
                <span className='hidden md:inline text-text-light dark:text-text-dark'>
                  {userInfo?.username}
                </span>
              </button>
              {isDropdownOpen && (
                <div className='absolute right-0 pt-4 group-hover:block'>
                  <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700 shadow-lg rounded dark:bg-gray-700'>
                    <NavLink
                      to='/profile'
                      className='hover:text-accent-light dark:hover:text-accent-dark duration-200 dark:text-text-light'
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to='/orders'
                      className='hover:text-accent-light dark:hover:text-accent-dark duration-200 dark:text-text-light'
                    >
                      My Orders
                    </NavLink>
                    <NavLink
                      to='/settings'
                      className='hover:text-accent-light dark:hover:text-accent-dark duration-200 dark:text-text-light'
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left hover:text-accent-light dark:hover:text-accent-dark duration-200 text-text-light dark:text-text-light'
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to='/login'
              className='flex items-center text-text-light dark:text-text-dark'
            >
              <IoPersonOutline size={26} />
            </NavLink>
          )}
          <NavLink
            to='#'
            className='relative text-text-light dark:text-text-dark'
            onClick={() => setIsCartModalOpen(true)} // Open modal on click
          >
            <BsHandbag size={26} className='align-middle' />
            <span className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-accent-light text-white aspect-square rounded-full text-[8px] dark:bg-accent-dark dark:text-black'>
              {cart?.items.length || 0} {/* Show number of items */}
            </span>
          </NavLink>

          <CartModal
            isOpen={isCartModalOpen}
            onClose={() => setIsCartModalOpen(false)}
          />

          <button
            onClick={handleThemeSwitch}
            className='text-text-light dark:text-text-dark'
          >
            {theme === 'light' ? (
              <HiOutlineMoon size={26} className='align-middle' />
            ) : (
              <HiOutlineSun size={26} className='align-middle' />
            )}
          </button>

          <button
            className='md:hidden text-text-light dark:text-text-dark cursor-pointer'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HiOutlineMenuAlt3 size={24} className='align-middle' />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-body-light dark:bg-body-dark flex flex-col z-50 ${
            isClosing ? 'slide-out' : 'slide-in'
          }`}
        >
          <div className='flex items-center p-4'>
            <button
              className='text-text-secondary-light dark:text-text-secondary-dark flex items-center'
              onClick={handleCloseMenu}
            >
              <HiOutlineChevronLeft size={24} />
              <span className='ml-2 text-lg dark:hover:text-accent-dark duration-150'>
                Back
              </span>
            </button>
          </div>
          <div className='flex flex-col'>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-lg py-2 pl-6 transition-colors duration-300 ${
                    isActive
                      ? 'bg-accent-light text-white'
                      : 'bg-body-light dark:bg-body-dark text-text-light hover:bg-text-light hover:text-white dark:text-text-dark dark:hover:bg-text-dark'
                  } border-b border-gray-600 dark:border-white`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
