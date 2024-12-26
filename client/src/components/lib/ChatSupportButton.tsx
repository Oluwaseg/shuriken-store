import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import ChatSupportModal from '../helper/ChatSupportModal';

const ChatSupportButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className='fixed bottom-28 right-8 bg-accent-light dark:bg-accent-dark text-white rounded-full p-3 shadow-lg transition-colors'
      >
        <MessageCircle size={24} />
      </button>
      <ChatSupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ChatSupportButton;
