import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5"; // Import the close icon

const Search: React.FC<{
  onClose: () => void;
  onSearch: (term: string) => void;
}> = ({ onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term); // Pass the search term to the parent component on each change
  };

  return (
    <div className="border-t border-b bg-gray-100 text-center relative">
      <form className="flex items-center justify-center p-5">
        <div className="inline-flex items-center border border-gray-400 px-5 py-2 rounded w-3/4 sm:w-1/2">
          <CiSearch className="w-5 h-5 mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none bg-inherit text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus // Automatically focuses on the input when opened
          />
        </div>
        <IoClose
          className="w-6 h-6 text-gray-600 cursor-pointer ml-3"
          onClick={onClose} // Close the search bar when the close button is clicked
        />
      </form>
    </div>
  );
};

export default Search;
