import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, BookOpen, Plus, X, Heart } from 'lucide-react';
import io from 'socket.io-client';
import { useForm } from 'react-hook-form';
import { userProfile } from '../store/userProfile/MyProfile';
const HomePage = () => {
  const [wallbooks, setWallbooks] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(42);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  const [isAddopen, setAddopen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ defaultValues: { author: '', text: '' } });

  const submitHandler = async (data) => {
    await onSubmit({ ...data, timestamp: new Date().toISOString() });
    reset();
  };

  const mockWallbooks = [
    {
      id: 1,
      text: 'Amazing space exploration 🚀',
      author: 'Alex',
      timestamp: new Date(),
      likes: 0,
      liked: false,
    },
    {
      id: 2,
      text: 'Coding at 2 AM ☕',
      author: 'Sarah',
      timestamp: new Date(),
      likes: 0,
      liked: false,
    },
    {
      id: 3,
      text: 'Breathtaking sunset 🌅',
      author: 'Mike',
      timestamp: new Date(),
      likes: 0,
      liked: false,
    },
    {
      id: 4,
      text: 'Learning React journey',
      author: 'Emma',
      timestamp: new Date(),
      likes: 0,
      liked: false,
    },
    {
      id: 5,
      text: 'Music is universal 🎵',
      author: 'David',
      timestamp: new Date(),
      likes: 0,
      liked: false,
    },
  ];

  useEffect(() => {
    const newSocket = io('http://localhost:405'); // Replace with real backend url
    setSocket(newSocket);

    console.log(newSocket);

    // Initially fetch wallbooks, chat messages, users...
    setWallbooks(mockWallbooks);
    setChatMessages([
      {
        id: 1,
        author: 'System',
        text: 'Welcome to the public chat! 👋',
        timestamp: new Date(),
      },
    ]);
    setChatUsers(['Alex', 'Sarah', 'Mike', 'Emma', 'David']);

    newSocket.on('onlineUsers', setOnlineUsers);
    newSocket.on('newWallbook', (wallbook) => {
      setWallbooks((prev) => [wallbook, ...prev.slice(0, 19)]);
    });
    newSocket.on('newChatMessage', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    newSocket.on('userTyping', (user) => {
      setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      }, 3000);
    });
    newSocket.on('chatUsers', setChatUsers);

    return () => newSocket.close();
  }, []);

  const token = localStorage.getItem('auth');

  const mine = async () => {
    try {
      const result = await dispatch(userProfile({ token }));
      if (userProfile.fulfilled.match(result)) {
        console.log('the request got sent');
      } else if (userProfile.rejected.match(result)) {
        console.log('the request got rejeceted');
      }
      if (userProfile.pending.match(result)) {
        return <h1>loadings</h1>;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    mine();
  }, [token]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      author: 'You',
      text: newMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, msg]);
    socket?.emit('sendMessage', msg);
    setNewMessage('');
  };

  const handleTyping = () => {
    socket?.emit('typing');
  };

  const toggleLike = (id) => {
    setWallbooks((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const liked = !w.liked;
          const likes = liked ? w.likes + 1 : w.likes - 1;
          return { ...w, liked, likes };
        }
        return w;
      })
    );
  };

  const FloatingWallbook = ({ wallbook, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        x: Math.sin(index * 0.5) * 20,
      }}
      exit={{ opacity: 0, scale: 0.8, y: -100 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        x: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
      }}
      className="absolute bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 max-w-xs shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/30 flex flex-col justify-between"
      style={{
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 70 + 10}%`,
        zIndex: isChatOpen ? 1 : Math.floor(Math.random() * 10) + 10,
      }}
    >
      <p className="text-gray-100 text-sm leading-relaxed mb-3">
        {wallbook.text}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span className="font-medium text-purple-300">@{wallbook.author}</span>
        <span>{new Date(wallbook.timestamp).toLocaleTimeString()}</span>
      </div>
      <button
        onClick={() => toggleLike(wallbook.id)}
        className={`mt-3 flex items-center space-x-1 text-sm font-medium transition-colors ${
          wallbook.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
        aria-label="Like"
      >
        <Heart
          className={`w-5 h-5 ${
            wallbook.liked ? 'fill-current' : 'stroke-current'
          }`}
        />
        <span>{wallbook.likes}</span>
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 p-6 bg-gray-900/95 backdrop-blur-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <BookOpen className="text-purple-400 w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">Wallbooks</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="text-sm text-gray-300">
              <span className="text-purple-400 font-semibold">
                {wallbooks.length}
              </span>{' '}
              wallbooks
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{onlineUsers} online</span>
            </div>
          </motion.div>
        </nav>
      </header>

      <div
        className={`relative h-screen transition-all duration-500 ${
          isChatOpen ? 'opacity-20 pointer-events-none blur-sm' : 'opacity-100'
        }`}
      >
        <AnimatePresence>
          {wallbooks.map((w, i) => (
            <FloatingWallbook key={w.id} wallbook={w} index={i} />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
          aria-label="Open Public Chat"
        >
          <MessageCircle className="w-6 h-6" />

          {onlineUsers > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {onlineUsers > 99 ? '99+' : onlineUsers}
            </div>
          )}

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 blur transition-all duration-300 scale-150"></div>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        className={`fixed bottom-9 z-50 transition-all duration-300 ${
          isChatOpen ? 'left-64' : 'left-28'
        }`}
      >
        <button
          onClick={() => setAddopen(true)}
          className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 hover:border-purple-500/50 text-gray-300 hover:text-white p-4 rounded-full shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-110 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setIsChatOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-700/50 pb-3 mb-3">
                <div className="flex items-center space-x-4">
                  <Users className="text-purple-400 w-6 h-6" />
                  <h3 className="text-white font-semibold text-lg">
                    Public Chat
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{onlineUsers} online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition p-2 rounded-lg"
                  aria-label="Close chat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden rounded-lg shadow-inner">
                <div className="w-64 bg-gray-800/80 border-r border-gray-700 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900">
                  <h4 className="text-gray-400 uppercase font-semibold text-xs mb-3">
                    Users Online
                  </h4>
                  <ul className="space-y-2 text-sm text-white">
                    {chatUsers.map((user) => (
                      <li key={user} className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span>{user}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col flex-grow p-3 bg-gray-900/95">
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 space-y-3 mb-3">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg ${
                          msg.author === 'You'
                            ? 'bg-purple-600/30 self-end'
                            : 'bg-gray-800/70 self-start'
                        } max-w-[70%]`}
                      >
                        <p className="text-gray-100 whitespace-pre-wrap">
                          {msg.text}
                        </p>
                        <div className="flex justify-between text-xs mt-1 text-gray-400 font-semibold">
                          <span>@{msg.author}</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {typingUsers.length > 0 && (
                    <div className="text-xs text-gray-400 mb-2">
                      {typingUsers.join(', ')} typing...
                    </div>
                  )}

                  <div className="flex space-x-3 items-center">
                    <textarea
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        } else {
                          handleTyping();
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="flex-grow resize-none rounded-lg bg-gray-800/50 border border-gray-700/50 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddopen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setAddopen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="max-w-lg mx-auto p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-purple-700/40 backdrop-blur-md"
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                  Share a Wallbook Thought
                </h2>

                <div className="mb-6">
                  <label
                    htmlFor="author"
                    className="block text-gray-300 text-lg font-semibold mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="author"
                    type="text"
                    {...register('author', {
                      required: 'Please enter your name',
                      maxLength: {
                        value: 30,
                        message: 'Name can be max 30 characters',
                      },
                    })}
                    placeholder="E.g., Alex"
                    className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/60 transition-shadow duration-300 ${
                      errors.author
                        ? 'ring-2 ring-red-500'
                        : 'ring-1 ring-gray-700'
                    }`}
                    autoComplete="off"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-500 font-semibold">
                      {errors.author.message}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="text"
                    className="block text-gray-300 text-lg font-semibold mb-2"
                  >
                    Your Wallbook
                  </label>
                  <textarea
                    id="text"
                    rows={5}
                    {...register('text', {
                      required: 'Wallbook text is required',
                      minLength: {
                        value: 10,
                        message: 'Please enter at least 10 characters',
                      },
                      maxLength: {
                        value: 250,
                        message: 'Maximum 250 characters allowed',
                      },
                    })}
                    placeholder="Share your thoughts here..."
                    className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/60 transition-shadow duration-300 ${
                      errors.text
                        ? 'ring-2 ring-red-500'
                        : 'ring-1 ring-gray-700'
                    }`}
                  />
                  {errors.text && (
                    <p className="mt-1 text-sm text-red-500 font-semibold">
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Posting Your Wallbook...'
                    : 'Post Your Wallbook'}
                </button>

                {isSubmitSuccessful && (
                  <p className="mt-6 text-center text-green-400 font-semibold text-lg animate-pulse">
                    ✅ Your wallbook has been successfully posted!
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
