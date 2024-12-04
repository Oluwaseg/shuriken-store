import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900 '>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='flex flex-col flex-1 overflow-hidden '>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-x-hidden overflow-y-auto pt-16'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
