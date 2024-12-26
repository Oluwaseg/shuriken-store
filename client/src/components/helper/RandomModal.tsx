import { CommandIcon } from 'lucide-react';
import React, { useState } from 'react';

const RandomModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className='fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-md'
      >
        <CommandIcon size={24} />
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-bold'>Random Modal</h2>
            <p>This is a random modal for unauthenticated users!</p>
            <button
              onClick={toggleModal}
              className='mt-4 px-4 py-2 bg-red-500 text-white rounded-lg'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomModal;
