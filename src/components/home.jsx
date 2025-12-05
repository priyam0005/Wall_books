import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Plus, X, LogIn, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thought } from '../store/thoughts/getThought';
import { createThought } from '../store/thoughts/createThought';

const HomePage = () => {
  const [wallbooks, setWallbooks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('auth');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthClick = () => {
    const token = localStorage.getItem('auth');
    if (token) {
      // Log out
      localStorage.removeItem('auth');
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  const mine = async () => {
    dispatch(thought());
  };

  const feedData = useSelector((state) => state.Iliana.feed);

  console.log(feedData);

  useEffect(() => {
    mine();
  }, []);

  useEffect(() => {
    // Map the API data to wallbooks format
    if (feedData && feedData.thoughts && feedData.thoughts.length > 0) {
      const mappedWallbooks = feedData.thoughts.map((item) => ({
        id: item._id,
        text: item.content,
        author: item.userId?.username || 'Anonymous',
        timestamp: new Date(item.createdAt),
        likes: item.likeCount || 0,
        liked: false,
      }));
      setWallbooks(mappedWallbooks);
    }
  }, [feedData]);

  const handleAddClick = () => {
    setShowCreateModal(true);
  };

  const handleCreateWallbook = async (data) => {
    // Get token from localStorage or your auth state
    const token = localStorage.getItem('auth'); // Adjust based on where you store your token

    if (!token) {
      console.error('No authentication token found');
      alert('Please login to post a thought');
      return;
    }

    try {
      const result = await dispatch(
        createThought({
          token: token,
          content: data.text,
        })
      );

      if (createThought.fulfilled.match(result)) {
        // Success - close modal and refresh feed
        setShowCreateModal(false);

        // Refresh the feed to show the new thought
        await dispatch(thought());

        console.log('Thought posted successfully!');
      } else {
        // Handle error
        console.error('Failed to post thought:', result.payload);
        alert('Failed to post thought. Please try again.');
      }
    } catch (error) {
      console.error('Error posting thought:', error);
      alert('An error occurred while posting.');
    }
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
        zIndex: Math.floor(Math.random() * 10) + 10,
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

  const NewWallbookForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ text: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
      const newErrors = {};

      if (!formData.text.trim()) {
        newErrors.text = 'Wallbook text is required';
      } else if (formData.text.length < 10) {
        newErrors.text = 'Please enter at least 10 characters';
      } else if (formData.text.length > 250) {
        newErrors.text = 'Maximum 250 characters allowed';
      }

      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validate();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      await onSubmit({ ...formData, timestamp: new Date().toISOString() });
      setIsSubmitting(false);
      setFormData({ text: '' });
      setErrors({});
    };

    return (
      <div className="max-w-lg w-full p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-purple-700/40 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
          Share a Wallbook Thought
        </h2>

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
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Share your thoughts here..."
            className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/60 transition-shadow duration-300 ${
              errors.text ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-700'
            }`}
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-500 font-semibold">
              {errors.text}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting Your Wallbook...' : 'Post Your Wallbook'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <BookOpen className="text-purple-400 w-6 h-6 md:w-7 md:h-7" />
            <h1 className="text-lg md:text-xl font-bold text-white">
              Wallbooks
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 border border-gray-700"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </>
              )}
            </button>
          </motion.div>
        </nav>
      </header>

      <div className="relative h-screen">
        <AnimatePresence>
          {wallbooks.map((w, i) => (
            <FloatingWallbook key={w.id} wallbook={w} index={i} />
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleAddClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 z-40"
        aria-label="Create wallbook"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8" />
      </motion.button>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute -top-4 -right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <NewWallbookForm onSubmit={handleCreateWallbook} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
