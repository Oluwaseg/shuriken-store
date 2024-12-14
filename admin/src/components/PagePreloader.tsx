import { motion } from 'framer-motion';
import React from 'react';

const PagePreloader: React.FC = () => {
  return (
    <div className='pageloader'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className='spinner'
      />
    </div>
  );
};

export default PagePreloader;
