import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import FAQSection from './FAQSection';
import LiveChatSection from './LiveChatSection';

interface ChatSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSupportModal: React.FC<ChatSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showLiveChat, setShowLiveChat] = useState(false);

  // Reset state when modal is closed
  const handleClose = () => {
    onClose();
    setShowLiveChat(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50'
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='bg-body-light dark:bg-body-dark w-full sm:w-[400px] max-h-[600px] sm:max-h-[700px] rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark bg-white/50 dark:bg-dark-light/50 backdrop-blur-md'>
              <div className='flex items-center gap-3'>
                {showLiveChat && (
                  <button
                    onClick={() => setShowLiveChat(false)}
                    className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
                  >
                    <ArrowLeft className='w-5 h-5 text-text-primary-light dark:text-text-primary-dark' />
                  </button>
                )}
                <h2 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                  {showLiveChat ? 'Live Chat Support' : 'How can we help?'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
              >
                <X className='w-5 h-5 text-text-primary-light dark:text-text-primary-dark' />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-hidden'>
              <AnimatePresence mode='wait'>
                {showLiveChat ? (
                  <motion.div
                    key='live-chat'
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    className='h-full'
                  >
                    <LiveChatSection />
                  </motion.div>
                ) : (
                  <motion.div
                    key='faq'
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    className='h-full'
                  >
                    <FAQSection onStartLiveChat={() => setShowLiveChat(true)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Only show in FAQ section */}
            {!showLiveChat && (
              <div className='p-4 border-t border-border-light dark:border-border-dark bg-white/50 dark:bg-dark-light/50 backdrop-blur-md'>
                <button
                  onClick={() => setShowLiveChat(true)}
                  className='w-full bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg'
                >
                  <MessageCircle className='w-5 h-5' />
                  Start Live Chat
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSupportModal;
