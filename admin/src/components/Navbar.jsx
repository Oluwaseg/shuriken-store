import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-secondary text-white shadow-md px-4 py-2 mt-2 mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar[0]?.url || "https://via.placeholder.com/40"}
          alt="User Profile"
          className="w-16 h-16 rounded-full object-contain object-center border-2 border-primary"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold fonts">
            {user?.name || "Guest"}
          </span>
          <span className="text-sm text-tertiary">
            {user?.email || "Email"}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-sm font-medium">{user?.role || "Role"}</p>
      </div>
    </div>
  );
};

export default Navbar;
