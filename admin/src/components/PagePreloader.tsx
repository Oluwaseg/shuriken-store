import React from "react";

const PagePreloader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="relative flex justify-center items-center">
        <div className="absolute h-20 w-20 bg-secondary rounded-full opacity-50 animate-wave"></div>
        <div className="absolute h-24 w-24 bg-primaryLight rounded-full opacity-30 animate-waveDelay"></div>
        <div className="absolute h-28 w-28 bg-primaryDark rounded-full opacity-10 animate-waveDelayMore"></div>
      </div>
    </div>
  );
};

export default PagePreloader;
