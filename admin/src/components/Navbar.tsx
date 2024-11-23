// // components/Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { toggleDarkMode } from "../redux/darkModeSlice";
import { MdMenu } from "react-icons/md";
import { logoutUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface User {
  avatar: { url: string }[];
  name: string;
  role: string;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );
  const user = useSelector(
    (state: RootState) => state.auth.user as User | null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMode = () => dispatch(toggleDarkMode());

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success("Logout successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error: { message: string }) => {
        console.error("Logout failed:", error.message);
        toast.error("Logout failed. Please try again.");
      });
  };

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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } shadow-md p-4 flex items-center justify-between`}
    >
      <div className="md:hidden" onClick={toggleSidebar}>
        <MdMenu
          size={25}
          className="cursor-pointer text-gray-600 dark:text-gray-300"
        />
      </div>

      <div className="flex-grow flex items-center mx-4 max-w-md relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleMode} aria-label="Toggle Dark Mode">
          {isDarkMode ? (
            <FaSun size={20} className="text-yellow-500" />
          ) : (
            <FaMoon size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <div className="relative">
          <img
            src={user?.avatar[0]?.url || "https://via.placeholder.com/80"}
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer object-cover"
            onClick={toggleDropdown}
          />
          <div
            className={`transition-transform duration-300 ease-in-out transform ${
              isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            } absolute right-0 mt-2 w-48 ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-900"
            } shadow-lg rounded-md border border-gray-200 dark:border-gray-700`}
            ref={dropdownRef}
          >
            <ul
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } transition-opacity duration-300 ease-in-out`}
            >
              <li className="px-4 py-2 border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="font-semibold">{user?.name || "Guest"}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role || "Role"}
                </div>
              </li>
              <li
                className="px-4 py-2 border-t hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
