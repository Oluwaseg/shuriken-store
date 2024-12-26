import { MessageCircle, Send, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';
import { useAppSelector } from '../../hooks';

interface Message {
  _id: string;
  sender: string;
  message: string;
  read: boolean;
  timestamp: string;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
}

const LiveChatSection: React.FC = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && userInfo?.id) {
      const newSocket = io('http://localhost:5050');
      setSocket(newSocket);

      newSocket.emit('joinChat', userInfo.id);

      newSocket.on('receiveMessage', (data) => {
        const formattedMessage = {
          _id: data.messageId,
          sender: data.senderId === userInfo.id ? 'user' : 'admin',
          message: data.message,
          read: false,
          timestamp: data.timestamp,
          deletedBySender: false,
          deletedByRecipient: false,
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, userInfo?.id]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat-history/${userInfo?.id}`
        );
        setMessages(
          response.data.chatHistory.map((msg: Message) => ({
            _id: msg._id,
            sender: msg.sender === userInfo?.id ? 'user' : 'admin',
            message: msg.message,
            read: msg.read,
            timestamp: msg.timestamp,
            deletedBySender: msg.deletedBySender,
            deletedByRecipient: msg.deletedByRecipient,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        toast.error('Failed to load chat history.');
      }
    };

    if (userInfo?.id) {
      fetchChatHistory();
    }
  }, [userInfo?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && socket && userInfo?.id) {
      const messageData = {
        senderId: userInfo.id,
        recipientId: 'admin',
        message,
      };

      try {
        const response = await axiosInstance.post(
          '/chat/send-message',
          messageData
        );

        if (response.data.success) {
          const { messageId, timestamp } = response.data;

          socket.emit('sendMessage', {
            senderId: userInfo.id,
            recipientId: 'admin',
            message,
            messageId,
          });

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              _id: messageId,
              sender: 'user',
              message: message,
              read: false,
              timestamp,
              deletedBySender: false,
              deletedByRecipient: false,
            },
          ]);

          setMessage('');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    console.log('Deleting message:', messageId);
    try {
      const response = await axiosInstance.put(
        `/chat/delete-message/${userInfo?.id}`,
        {
          chatId: messageId,
        }
      );

      if (response.data.message === 'Message deleted for user') {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, deletedBySender: true } : msg
          )
        );
        toast.success('Message deleted successfully');
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('An error occurred while deleting the message');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center h-full p-6 text-center space-y-4'>
        <div className='p-4 rounded-full bg-accent-light/10 dark:bg-accent-dark/10'>
          <MessageCircle className='w-8 h-8 text-accent-light dark:text-accent-dark' />
        </div>
        <p className='text-text-primary-light dark:text-text-primary-dark font-medium'>
          Please log in to start chatting
        </p>
        <p className='text-text-secondary-light dark:text-text-secondary-dark text-sm'>
          You need to be logged in to use our live chat support
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[70vh] w-full max-w-4xl mx-auto bg-body-light dark:bg-body-dark rounded-lg shadow-lg overflow-hidden'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length > 0 ? (
          messages
            .filter((msg) => !msg.deletedBySender && !msg.deletedByRecipient)
            .map((msg) => (
              <div
                key={msg._id || msg.timestamp || Math.random()}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`
                    relative group max-w-[80%] px-4 py-2 rounded-2xl
                    ${
                      msg.sender === 'user'
                        ? 'bg-accent-light dark:bg-accent-dark text-white ml-12'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark mr-12'
                    }
                  `}
                >
                  <div className='mb-1 text-sm font-medium opacity-75'>
                    {msg.sender === 'user'
                      ? userInfo?.username || 'You'
                      : 'Support Agent'}
                  </div>
                  <div className='text-sm'>{msg.message}</div>
                  <div className='mt-1 flex items-center justify-end gap-2 text-[10px] opacity-0 group-hover:opacity-75 transition-opacity'>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    <span>{msg.read ? '✓✓' : '✓'}</span>
                    {msg.sender === 'user' && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center space-y-2 text-text-secondary-light dark:text-text-secondary-dark'>
            <MessageCircle className='w-12 h-12 mb-2 opacity-50' />
            <p className='font-medium'>No messages yet</p>
            <p className='text-sm'>Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 bg-white/50 dark:bg-dark-light/50 backdrop-blur-md border-t border-border-light dark:border-border-dark'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 px-4 py-2 rounded-xl bg-body-light dark:bg-body-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all'
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className='p-2 rounded-xl bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatSection;
