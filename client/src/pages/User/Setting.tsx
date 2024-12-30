import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Home,
  Lock,
  Menu,
  Shield,
  UserCircle,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Socials } from './libs/socialInfo';
import { UpdateUserPassword } from './libs/validate-password';

const settingsSections = [
  {
    id: 'social',
    title: 'Social Information',
    icon: UserCircle,
    component: Socials,
  },
  {
    id: 'password',
    title: 'Update Password',
    icon: Lock,
    component: UpdateUserPassword,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    component: () => <p>Manage your notification preferences. (Coming soon)</p>,
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    icon: Shield,
    component: () => <p>Control your privacy settings. (Coming soon)</p>,
  },
  {
    id: 'account',
    title: 'Account Management',
    icon: UserCircle,
    component: () => <p>Manage your account settings. (Coming soon)</p>,
  },
];

const Setting: React.FC = () => {
  const [activeSection, setActiveSection] = useState('social');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ActiveComponent =
    settingsSections.find((section) => section.id === activeSection)
      ?.component || (() => null);

  return (
    <div className='flex min-h-screen bg-primary dark:bg-body-dark text-text-primary-light dark:text-text-primary-dark'>
      {/* Sidebar for larger screens */}
      <motion.nav
        className='hidden md:block w-64 bg-body-light dark:bg-dark-light p-6 shadow-lg'
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </motion.nav>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='fixed right-0 top-0 bottom-0 w-64 bg-body-light dark:bg-dark-light p-6 shadow-lg'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='absolute top-4 right-4 text-text-primary-light dark:text-text-primary-dark'
              >
                <X className='h-6 w-6' />
              </button>
              <SidebarContent
                activeSection={activeSection}
                setActiveSection={(section) => {
                  setActiveSection(section);
                  setIsSidebarOpen(false);
                }}
              />
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className='flex-1 flex flex-col'>
        <header className='bg-body-light dark:bg-dark-light shadow-sm'>
          <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-4'>
                <nav className='flex' aria-label='Breadcrumb'>
                  <ol className='inline-flex items-center space-x-1 md:space-x-3'>
                    <li className='inline-flex items-center'>
                      <a
                        href='/'
                        className='inline-flex items-center text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:text-accent-light dark:hover:text-accent-dark'
                      >
                        <Home className='w-4 h-4 mr-2' />
                        Home
                      </a>
                    </li>
                    <li>
                      <div className='flex items-center'>
                        <ChevronRight className='w-4 h-4 text-gray-400' />
                        <span className='ml-1 text-sm font-medium text-accent-light dark:text-accent-dark'>
                          Settings
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className='flex items-center'>
                <button
                  className='md:hidden text-text-primary-light dark:text-text-primary-dark'
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className='h-6 w-6' />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
          <div className='max-w-3xl mx-auto'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{
  activeSection: string;
  setActiveSection: (section: string) => void;
}> = ({ activeSection, setActiveSection }) => (
  <>
    <h2 className='text-xl font-semibold mb-6'>Settings</h2>
    <ul className='space-y-2'>
      {settingsSections.map((section) => (
        <motion.li
          key={section.id}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center p-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-accent-light dark:bg-accent-dark text-white dark:text-text-primary-dark'
                : 'hover:bg-input-light dark:hover:bg-input-dark'
            }`}
          >
            <section.icon className='h-5 w-5 mr-3' />
            <span>{section.title}</span>
            {activeSection === section.id && (
              <ChevronRight className='ml-auto h-4 w-4' />
            )}
          </button>
        </motion.li>
      ))}
    </ul>
  </>
);

export default Setting;
