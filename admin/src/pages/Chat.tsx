import React, { useEffect, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaCheck,
  FaChevronDown,
  FaComments,
  FaPaperPlane,
  FaSearch,
  FaStar,
  FaTrash,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { RootState } from '../redux/store';
import apiClient from '../services/apiClient';
import { ChatMessage, User } from '../types';

const ChatPage: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [chatsSummary, setChatsSummary] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && token) {
      const newSocket = io('http://localhost:5050');
      setSocket(newSocket);

      if (user.role.includes('admin')) {
        newSocket.emit('adminConnect', user.id);
      } else {
        newSocket.emit('joinChat', user.id);
      }

      newSocket.on('receiveMessage', (data) => {
        if (
          selectedUserId === data.senderId ||
          selectedUserId === data.recipientId
        ) {
          setChatHistory((prevHistory) => {
            // Check if the message already exists in the chat history
            const messageExists = prevHistory.some(
              (msg) =>
                msg.sender === data.senderId &&
                msg.message === data.message &&
                msg.timestamp === data.timestamp
            );

            // Only add the message if it doesn't already exist
            return messageExists ? prevHistory : [...prevHistory, data];
          });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, token, selectedUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [token]);

  const fetchChatHistory = async (userId: string) => {
    try {
      const response = await apiClient.get(`/chat-history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatHistory(response.data.chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchChatsSummary = async () => {
    try {
      const response = await apiClient.get('/chat/summary', {
        params: { adminId: user?.id },
      });
      setChatsSummary(response.data.chatsSummary);
    } catch (error) {
      console.error('Error fetching chats summary:', error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchChatsSummary();
    }
  }, [user, token]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current;
      const isScrolledToBottom =
        scrollContainer.scrollHeight - scrollContainer.clientHeight <=
        scrollContainer.scrollTop + 1;

      if (isScrolledToBottom) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory]);

  useEffect(() => {
    if (chatContainerRef.current && selectedUserId) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedUserId]);

  const handleSendMessage = async () => {
    if (currentMessage && selectedUserId && socket) {
      const messageData = {
        senderId: user?.id,
        recipientId: selectedUserId,
        message: currentMessage,
        timestamp: new Date().toISOString(),
      };

      try {
        await apiClient.post('/chat/send-message', messageData);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            id: '',
            sender: user?.id || '',
            recipient: selectedUserId,
            message: currentMessage,
            read: false,
            deleteBySender: false,
            deleteByRecipient: false,
            timestamp: new Date().toISOString(),
          },
        ]);

        // Update chat summary if the user isn't already in it
        const userExistsInSummary = chatsSummary.some(
          (chat) => chat.userId === selectedUserId
        );

        if (!userExistsInSummary) {
          const selectedUser = users.find((user) => user.id === selectedUserId);
          setChatsSummary((prevSummary) => [
            ...prevSummary,
            {
              userId: selectedUserId,
              userName: selectedUser ? selectedUser.name : 'Unknown User',
              lastMessage: currentMessage,
            },
          ]);
        } else {
          // Update lastMessage in chat summary
          setChatsSummary((prevSummary) =>
            prevSummary.map((chat) =>
              chat.userId === selectedUserId
                ? { ...chat, lastMessage: currentMessage }
                : chat
            )
          );
        }

        socket.emit('sendMessage', messageData);
        setCurrentMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    fetchChatHistory(userId);
    setIsDropdownOpen(false);
    setIsMobileSidebarOpen(false);
    const selectedUser = users.find((user) => user.id === userId);
    setSelectedUserName(selectedUser ? selectedUser.name ?? '' : '');
  };

  const handleDeleteChat = async () => {
    if (selectedUserId) {
      try {
        await apiClient.delete(`/chat/delete-chat-history/${selectedUserId}`);
        setChatHistory([]);
        setSelectedUserId(null);
        setSelectedUserName('');
        fetchChatsSummary();
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col md:flex-row h-screen bg-body-light dark:bg-body-dark'>
      {/* Sidebar */}
      <div
        className={`${
          isMobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-80 bg-primary-light dark:bg-dark-secondary p-4 overflow-y-auto`}
      >
        <h2 className='text-2xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark'>
          Chat Summary
        </h2>
        <div className='relative mb-4'>
          <input
            type='text'
            placeholder='Search users...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-3 py-2 pl-10 rounded-md bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
          />
          <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark' />
        </div>
        <ul className='space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]'>
          {chatsSummary.length === 0 ? (
            <li className='text-center text-text-secondary-light dark:text-text-secondary-dark'>
              No messages
            </li>
          ) : (
            chatsSummary.map((summary, index) => (
              <li
                key={index}
                onClick={() => handleSelectUser(summary.userId)}
                className='flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent-light hover:bg-opacity-10 dark:hover:bg-accent-dark dark:hover:bg-opacity-10 transition duration-150 ease-in-out'
              >
                <FaComments className='mr-3 text-text-secondary-light dark:text-text-secondary-dark' />
                <div>
                  <p className='font-medium text-text-primary-light dark:text-text-primary-dark'>
                    {summary.userName}
                  </p>
                  <p className='text-xs text-text-secondary-light dark:text-text-secondary-dark truncate'>
                    {summary.lastMessage}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='bg-primary-light dark:bg-dark-secondary p-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className='md:hidden mr-4 text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
            >
              <FaArrowLeft />
            </button>
            <h1 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
              {selectedUserName || 'Chat'}
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-white rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-200 whitespace-nowrap'
              >
                Chat with User <FaChevronDown className='ml-2' />
              </button>
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-white dark:bg-dark-secondary rounded-md shadow-lg z-10'>
                  <ul className='max-h-60 overflow-y-auto'>
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      >
                        <img
                          src={user.avatar?.[0]?.url || ''}
                          alt={user.name || ''}
                          className='w-8 h-8 rounded-full mr-2'
                        />
                        <span>{user.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Area */}
        {selectedUserId ? (
          <div className='flex-1 flex flex-col bg-body-light dark:bg-body-dark'>
            <div className='bg-primary-light dark:bg-dark-secondary p-4 flex justify-end items-center'>
              <div className='flex items-center space-x-4'>
                <button className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark p-2'>
                  <FaStar />
                </button>
                <button
                  onClick={handleDeleteChat}
                  className='text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400 p-2'
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div
              ref={chatContainerRef}
              className='flex-1 overflow-y-auto p-4 space-y-4'
            >
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                      msg.sender === user?.id
                        ? 'bg-accent-light dark:bg-accent-dark text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    <p className='text-sm'>{msg.message}</p>
                    <div className='flex items-center space-x-1 mt-1'>
                      <p className='text-xs '>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                      {msg.sender === user?.id && (
                        <div className='text-xs  flex items-center'>
                          {msg.read ? (
                            <span className='flex items-center'>
                              <FaCheck className='mr-1' /> <FaCheck />
                            </span>
                          ) : (
                            <FaCheck />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='p-4 border-t border-border-light dark:border-border-dark'>
              <div className='flex items-center space-x-2'>
                <input
                  type='text'
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder='Type your message...'
                  className='flex-1 px-4 py-2 rounded-lg bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                />
                <button
                  onClick={handleSendMessage}
                  className='p-2 bg-accent-light dark:bg-accent-dark text-white rounded-lg hover:bg-opacity-90 transition duration-200'
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-body-light dark:bg-body-dark text-text-secondary-light dark:text-text-secondary-dark'>
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
