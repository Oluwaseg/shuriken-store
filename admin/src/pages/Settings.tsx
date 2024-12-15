import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ProfileSettings from '../components/settings/Profile';

const SettingsPage: React.FC = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Setting</title>
          <meta name='description' content='Admin Setting Page' />
        </Helmet>
      </HelmetProvider>
      <div className='min-h-screen bg-body-light dark:bg-body-dark py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto bg-body-light dark:bg-body-dark shadow-md rounded-lg'>
          <h1 className='text-3xl font-semibold p-6 border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark'>
            Settings
          </h1>
          <div className='p-6'>
            <ProfileSettings />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
