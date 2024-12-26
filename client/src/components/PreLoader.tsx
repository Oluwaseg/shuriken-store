import { motion } from 'framer-motion';
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className='preloader'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className='spinner'
      />
    </div>
  );
};

export default Preloader;
