import React, { useState } from 'react';
import {
  FaArchive,
  FaInbox,
  FaPaperclip,
  FaSearch,
  FaStar,
  FaTag,
  FaTrashAlt,
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

interface Message {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  archived: boolean;
}

interface Conversation {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  messages: {
    id: number;
    content: string;
    timestamp: string;
    isAdmin: boolean;
  }[];
  starred: boolean;
  archived: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    messages: [
      {
        id: 1,
        content: 'Hi, I have a question about my recent order.',
        timestamp: '10:30 AM',
        isAdmin: false,
      },
      {
        id: 2,
        content: "Hello John, I'd be happy to help. What's your order number?",
        timestamp: '10:32 AM',
        isAdmin: true,
      },
      {
        id: 3,
        content: "It's #12345. I haven't received any shipping updates.",
        timestamp: '10:35 AM',
        isAdmin: false,
      },
    ],
    starred: false,
    archived: false,
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    messages: [
      {
        id: 1,
        content: "I'd like to return an item. What's the process?",
        timestamp: 'Yesterday',
        isAdmin: false,
      },
      {
        id: 2,
        content:
          'Hi Jane, I can assist you with that. Which item do you want to return?',
        timestamp: 'Yesterday',
        isAdmin: true,
      },
    ],
    starred: true,
    archived: false,
  },
  {
    id: 3,
    user: {
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    messages: [
      {
        id: 1,
        content: 'Is the summer collection available yet?',
        timestamp: 'Jul 15',
        isAdmin: false,
      },
    ],
    starred: false,
    archived: true,
  },
];

const Inbox: React.FC = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('inbox');
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: conv.messages.length + 1,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                isAdmin: true,
              },
            ],
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      setSelectedConversation(
        updatedConversations.find(
          (conv) => conv.id === selectedConversation.id
        ) || null
      );
      setNewMessage('');
    }
  };

  const handleStar = (id: number) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, starred: !conv.starred } : conv
      )
    );
  };

  const handleArchive = (id: number) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, archived: !conv.archived } : conv
      )
    );
  };

  const handleDelete = (id: number) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (activeSection === 'inbox') return !conv.archived;
    if (activeSection === 'starred') return conv.starred;
    if (activeSection === 'archive') return conv.archived;
    return true;
  });

  return (
    <div className='flex flex-col md:flex-row h-full bg-body-light dark:bg-body-dark'>
      {/* Sidebar */}
      <div className='w-full md:w-64 bg-primary-light dark:bg-dark-secondary p-4 md:hidden lg:block'>
        <h2 className='text-2xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
          Inbox
        </h2>
        <ul className='space-y-2'>
          {['inbox', 'starred', 'archive', 'tags'].map((section) => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`flex items-center space-x-2 w-full p-2 rounded ${
                  activeSection === section
                    ? 'bg-accent-light dark:bg-accent-dark text-white'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-accent-light hover:bg-opacity-10 dark:hover:bg-accent-dark dark:hover:bg-opacity-10'
                }`}
              >
                {section === 'inbox' && <FaInbox />}
                {section === 'starred' && <FaStar />}
                {section === 'archive' && <FaArchive />}
                {section === 'tags' && <FaTag />}
                <span className='capitalize'>{section}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversation List */}
      <div
        className={`w-full md:w-1/3 border-r border-border-light dark:border-border-dark ${
          mobileView === 'conversation' ? 'hidden md:block' : ''
        }`}
      >
        <div className='bg-primary-light dark:bg-dark-secondary p-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search conversations...'
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark' />
          </div>
        </div>
        <div className='overflow-auto h-[calc(100vh-10rem)]'>
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 border-b border-border-light dark:border-border-dark hover:bg-accent-light hover:bg-opacity-10 dark:hover:bg-accent-dark dark:hover:bg-opacity-10 cursor-pointer group ${
                selectedConversation?.id === conversation.id
                  ? 'bg-accent-light bg-opacity-20 dark:bg-accent-dark dark:bg-opacity-20'
                  : ''
              }`}
              onClick={() => {
                setSelectedConversation(conversation);
                setMobileView('conversation');
              }}
            >
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className='w-12 h-12 rounded-full mr-4'
              />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate'>
                  {conversation.user.name}
                </p>
                <p className='text-xs text-text-secondary-light dark:text-text-secondary-dark truncate'>
                  {
                    conversation.messages[conversation.messages.length - 1]
                      .content
                  }
                </p>
              </div>
              <div className='ml-4 flex-shrink-0'>
                <p className='text-xs text-text-secondary-light dark:text-text-secondary-dark'>
                  {
                    conversation.messages[conversation.messages.length - 1]
                      .timestamp
                  }
                </p>
                <div className='flex space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStar(conversation.id);
                    }}
                    className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
                  >
                    <FaStar
                      className={
                        conversation.starred
                          ? 'text-accent-light dark:text-accent-dark'
                          : ''
                      }
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(conversation.id);
                    }}
                    className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
                  >
                    <FaArchive />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conversation.id);
                    }}
                    className='text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400'
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      {selectedConversation ? (
        <div
          className={`flex-1 flex flex-col bg-body-light dark:bg-body-dark ${
            mobileView === 'list' ? 'hidden md:flex' : ''
          }`}
        >
          <div className='bg-primary-light dark:bg-dark-secondary p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark'>
            <div className='flex items-center'>
              <button
                className='md:hidden mr-2 text-text-secondary-light dark:text-text-secondary-dark'
                onClick={() => setMobileView('list')}
              >
                &larr;
              </button>
              <img
                src={selectedConversation.user.avatar}
                alt={selectedConversation.user.name}
                className='w-10 h-10 rounded-full mr-4'
              />
              <h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                {selectedConversation.user.name}
              </h3>
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={() => handleStar(selectedConversation.id)}
                className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
              >
                <FaStar
                  className={
                    selectedConversation.starred
                      ? 'text-accent-light dark:text-accent-dark'
                      : ''
                  }
                />
              </button>
              <button
                onClick={() => handleArchive(selectedConversation.id)}
                className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
              >
                <FaArchive />
              </button>
              <button
                onClick={() => handleDelete(selectedConversation.id)}
                className='text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400'
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className='flex-1 overflow-auto p-4 space-y-4'>
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isAdmin ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                    message.isAdmin
                      ? 'bg-accent-light dark:bg-accent-dark text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark'
                  }`}
                >
                  <p className='text-sm'>{message.content}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className='p-4 border-t border-border-light dark:border-border-dark'>
            <div className='flex items-center'>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type your message...'
                className='flex-1 px-4 py-2 rounded-l-lg bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
              />
              <label
                htmlFor='file-upload'
                className='cursor-pointer px-4 py-2 bg-button-secondary-light dark:bg-button-secondary-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200'
              >
                <FaPaperclip />
                <input id='file-upload' type='file' className='hidden' />
              </label>
              <button
                onClick={handleSendMessage}
                className='px-4 py-2 bg-accent-light dark:bg-accent-dark text-white rounded-r-lg hover:bg-opacity-90 transition duration-200'
              >
                <IoMdSend />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='hidden md:flex items-center justify-center flex-1 bg-body-light dark:bg-body-dark text-text-secondary-light dark:text-text-secondary-dark'>
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
};

export default Inbox;
