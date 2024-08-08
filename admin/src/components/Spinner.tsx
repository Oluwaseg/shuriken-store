import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-t-4 border-teal-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
