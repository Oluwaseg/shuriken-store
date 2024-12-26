import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const ScrollButton: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Function to scroll to the top or bottom
  const scrollTo = () => {
    if (scrollDirection === 'up') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Show button when user scrolls past 100px
      setIsVisible(window.scrollY > 100);

      // Determine scroll direction
      if (window.scrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollTo}
        className='fixed bottom-20 right-4 bg-black text-white dark:bg-white dark:text-black p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors'
        aria-label={
          scrollDirection === 'up' ? 'Scroll to top' : 'Scroll to bottom'
        }
      >
        {scrollDirection === 'up' ? (
          <FaArrowUp size={20} />
        ) : (
          <FaArrowDown size={20} />
        )}
      </button>
    )
  );
};

export default ScrollButton;
