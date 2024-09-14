import React from "react";
import ProfileSettings from "../components/settings/Profile";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SettingsPage: React.FC = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Setting</title>
          <meta name="description" content="Admin Setting Page" />
        </Helmet>
      </HelmetProvider>
      <div className="min-h-screen bg-primary dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
          <h1 className="text-3xl font-semibold p-6 border-b border-gray-200">
            Settings
          </h1>
          <div className="p-6">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
