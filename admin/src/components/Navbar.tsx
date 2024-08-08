import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { toggleDarkMode } from "../redux/darkModeSlice";

interface User {
  avatar: { url: string }[];
  name: string;
  role: string;
}

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );
  const user = useSelector(
    (state: RootState) => state.auth.user as User | null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMode = () => dispatch(toggleDarkMode());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Apply dark mode class to the HTML element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow-md p-4 flex items-center justify-between`}
    >
      {/* Middle: Search Input */}
      <div className="flex-grow flex items-center mx-4 max-w-md">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-1 border rounded-md w-full max-w-md"
          />
        </div>
      </div>

      {/* Right: Mode Toggle and User Avatar */}
      <div className="flex items-center gap-4">
        <button onClick={toggleMode} aria-label="Toggle Dark Mode">
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        <div className="relative">
          <img
            src={user?.avatar[0]?.url || "https://via.placeholder.com/40"}
            alt="User Profile"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-gray-500 cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <ul
              ref={dropdownRef}
              className={`absolute right-0 mt-2 w-48 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } shadow-lg rounded-md border border-gray-200 transition-transform duration-300 ease-in-out`}
            >
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                {user?.name || "Guest"}
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                {user?.role || "Role"}
              </li>
              <li className="px-4 py-2 border-t hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
