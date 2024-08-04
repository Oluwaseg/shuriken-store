import { useState } from "react";
import Circle from "../assets/circle.svg";
import Shuriken from "../assets/shuriken.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative px-4 py-4 flex justify-between items-center bg-violet-600">
      <a
        className="flex items-center space-x-2 text-2xl font-bold leading-none"
        href="#"
      >
        <div className="relative w-12 h-12">
          <img
            src={Circle}
            alt="circle"
            className="absolute inset-0 w-full h-full"
          />
          <img
            src={Shuriken}
            alt="shuriken"
            className="absolute w-1/2 h-1/2 top-1/4 left-1/4"
          />
        </div>
        <span className="text-white">Ninja Store</span>
      </a>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          className="navbar-burger flex items-center text-white p-3"
          onClick={toggleMenu}
        >
          <svg
            className="block h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
        <li>
          <a className="text-sm text-white" href="#">
            Home
          </a>
        </li>
        <li>
          <a className="text-sm text-white" href="#">
            Products
          </a>
        </li>
        <li>
          <a className="text-sm text-white" href="#">
            Blog
          </a>
        </li>
        <li>
          <a className="text-sm text-white" href="#">
            About Us
          </a>
        </li>
        <li>
          <a className="text-sm text-white" href="#">
            Contact
          </a>
        </li>
      </ul>

      {/* Sign In/Sign Up Buttons */}
      <div className="hidden lg:flex space-x-3">
        <a
          className="py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
          href="#"
        >
          Sign In
        </a>
        <a
          className="py-2 px-6 text-purple-800 text-sm bg-white font-bold rounded-xl transition duration-200"
          href="#"
        >
          Sign Up
        </a>
      </div>

      {/* Mobile Menu */}
      <div
        className={`navbar-menu absolute top-0 left-0 right-0 bottom-0 bg-white z-50 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity duration-300 ease-in-out`}
      >
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center mb-8">
            <a
              className="mr-auto flex items-center space-x-2 text-2xl font-bold leading-none"
              href="#"
            >
              <div className="relative w-12 h-12">
                <img
                  src={Circle}
                  alt="circle"
                  className="absolute inset-0 w-full h-full"
                />
                <img
                  src={Shuriken}
                  alt="shuriken"
                  className="absolute w-1/2 h-1/2 top-1/4 left-1/4"
                />
              </div>
              <span className="text-violet-600">Ninja Store</span>
            </a>
            <button
              className="navbar-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6 text-violet-400 cursor-pointer hover:text-violet-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-violet-600 hover:bg-violet-600 hover:text-white rounded"
                  href="#"
                >
                  Home
                </a>
              </li>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-violet-600 hover:bg-violet-600 hover:text-white rounded"
                  href="#"
                >
                  Products
                </a>
              </li>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-violet-600 hover:bg-violet-600 hover:text-white rounded"
                  href="#"
                >
                  Blog
                </a>
              </li>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-violet-600 hover:bg-violet-600 hover:text-white rounded"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li className="mb-1">
                <a
                  className="block p-4 text-sm font-semibold text-violet-600 hover:bg-violet-600 hover:text-white rounded"
                  href="#"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <a
                className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl"
                href="#"
              >
                Sign in
              </a>
              <a
                className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-violet-600 hover:bg-violet-700 rounded-xl"
                href="#"
              >
                Sign Up
              </a>
            </div>
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
