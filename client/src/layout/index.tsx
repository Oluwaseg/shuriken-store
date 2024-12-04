import React from 'react';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col bg-primary dark:bg-gray-900 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
