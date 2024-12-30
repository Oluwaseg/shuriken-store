import { motion } from 'framer-motion';
import { Dribbble, Facebook, Github, Twitter } from 'lucide-react';
import React from 'react';

const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, connected: false, color: 'bg-blue-600' },
  { name: 'Twitter', icon: Twitter, connected: true, color: 'bg-sky-500' },
  { name: 'Github', icon: Github, connected: false, color: 'bg-gray-800' },
  { name: 'Dribbble', icon: Dribbble, connected: false, color: 'bg-pink-500' },
];

const SocialButton: React.FC<{
  name: string;
  icon: React.ElementType;
  connected: boolean;
  color: string;
}> = ({ name, icon: Icon, connected, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className='bg-white dark:bg-dark-secondary rounded-md shadow-sm overflow-hidden'
  >
    <div className='p-3 flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <div className={`p-1.5 rounded-full ${color}`}>
          <Icon className='h-4 w-4 text-white' />
        </div>
        <span className='text-sm font-medium'>{name}</span>
      </div>
      <button
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          connected
            ? 'bg-accent-light text-white dark:bg-accent-dark'
            : 'bg-input-light text-text-primary-light dark:bg-input-dark dark:text-text-primary-dark'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  </motion.div>
);

export const Socials: React.FC = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold mb-3'>Connected Accounts</h2>
      <div className='grid gap-3 sm:grid-cols-2'>
        {socialPlatforms.map((platform) => (
          <SocialButton key={platform.name} {...platform} />
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='w-full bg-button-primary-light hover:bg-button-hover-light dark:bg-button-primary-dark dark:hover:bg-button-hover-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200'
      >
        Save Changes
      </motion.button>
    </div>
  );
};
