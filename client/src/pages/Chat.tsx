import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../api/axiosInstance';
import { resetAuthState } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const ChatPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { sender: string; content: string; read: boolean }[]
  >([]);

  // Establish Socket Connection
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:5050');
      setSocket(newSocket);

      newSocket.emit('joinChat', userInfo?.id);

      newSocket.on('receiveMessage', (data) => {
        console.log('New socket message:', data);
        const formattedMessage = {
          sender: data.senderId === 'admin' ? 'admin' : 'meee', // or any mapping you prefer
          content: data.message, // 'message' is what the backend sends
          read: false, // Default to unread
          timestamp: data.timestamp,
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, userInfo?.id]);

  // Fetch Chat History
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat-history/${userInfo?.id}`
        );
        console.log('Chat history:', response.data.chatHistory);
        setMessages(
          response.data.chatHistory.map(
            (msg: { sender: string; message: string; read: boolean }) => ({
              sender: msg.sender,
              content: msg.message,
              read: msg.read,
            })
          )
        );
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        toast.error('Failed to load chat history.');
      }
    };

    if (userInfo?.id) {
      fetchChatHistory();
    }
  }, [userInfo]);

  // Send Message
  const handleSendMessage = async () => {
    if (message.trim() && socket) {
      const messageData = {
        senderId: userInfo?.id, // User ID
        recipientId: 'admin', // Always sending to the admin
        message,
      };

      try {
        // Send the message to the server
        const response = await axiosInstance.post(
          '/chat/send-message',
          messageData
        );

        // Log the entire server response
        console.log('Server Response:', response.data);

        // Check if the response contains the expected success field
        if (response.data.success) {
          const { messageId, timestamp } = response.data;

          socket.emit(
            'sendMessage',
            {
              senderId: userInfo?.id,
              recipientId: 'admin',
              message,
              messageId,
            },
            (response: { success: boolean; message: string }) => {
              if (response.success) {
                console.log('Message sent successfully');
              } else {
                console.error('Socket sendMessage failed:', response.message);
              }
            }
          );

          // Update messages in the UI
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: messageId,
              sender: userInfo?.id || 'unknown',
              content: message,
              timestamp,
              read: false,
            },
          ]);

          // Clear input field
          setMessage('');
        } else {
          console.error(
            'Failed to send message:',
            response.data.error || 'Unknown error'
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to send message:', error.message);
        } else {
          console.error('Failed to send message:', error);
        }
      }
    }
  };

  const handleLogout = () => {
    dispatch(resetAuthState());
    toast.success('Logged out successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className='text-center text-gray-700'>
        Please log in to start chatting.
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <div className='flex items-center justify-between p-4 bg-blue-600 text-white'>
        <h2 className='text-xl font-semibold'>
          Welcome, {userInfo?.name || 'User'}!
        </h2>
        <button
          onClick={handleLogout}
          className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md'
        >
          Logout
        </button>
      </div>

      <div className='flex flex-col flex-grow overflow-y-auto p-4 space-y-4'>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === userInfo?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg text-sm ${
                  msg.sender === userInfo?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-900'
                }`}
              >
                <div>
                  <strong>
                    {msg.sender === userInfo?.id
                      ? 'You'
                      : msg.sender === 'admin' // Check if the sender is 'admin'
                      ? 'Admin' // If it’s the admin, display "Admin"
                      : msg.sender}
                  </strong>{' '}
                  {msg.content}
                </div>
                {msg.sender === userInfo?.id && (
                  <div className='text-right text-xs mt-1'>
                    {msg.read ? '✔✔' : '✔'}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-600'>
            No messages yet. Start chatting!
          </p>
        )}
      </div>

      <div className='flex items-center p-4 bg-white border-t border-gray-200'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message...'
          className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={handleSendMessage}
          className='ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
