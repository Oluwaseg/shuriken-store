import React, { useState } from "react";

const SearchInput = () => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const categories = [
    { id: 1, link: "#", title: "Category 1" },
    { id: 2, link: "#", title: "Category 2" },
    { id: 3, link: "#", title: "Category 3" },
  ];

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (!document.getElementById("categoryFilterBtn").contains(event.target)) {
      setCategoryDropdownOpen(false);
    }
    if (!document.getElementById("filterBtn").contains(event.target)) {
      setFilterDropdownOpen(false);
    }
  };

  // Attach click outside handler on mount
  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative px-4 py-4 flex flex-wrap justify-between items-center bg-gray-100">
      <form className="flex w-full lg:max-w-xl mx-auto">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
          placeholder="Search products..."
        />
        <button
          type="submit"
          className="px-4 bg-violet-600 text-white rounded-r-lg hover:bg-violet-700 transition duration-200"
        >
          Search
        </button>
      </form>
      <div className="flex space-x-3 mt-4 lg:mt-0 ml-4 lg:ml-0">
        <div className="relative">
          <button
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
            id="categoryFilterBtn"
            onClick={toggleCategoryDropdown}
          >
            Category
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {categoryDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={category.link}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-center md:text-left"
                >
                  {category.title}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
            id="filterBtn"
            onClick={toggleFilterDropdown}
          >
            Filter
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Filter 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Filter 2
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Filter 3
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SearchInput;
