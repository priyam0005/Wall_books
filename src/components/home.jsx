import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  X,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  MoreVertical,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thought } from '../store/thoughts/getThought';
import { createThought } from '../store/thoughts/createThought';
import chica from '../assets/chica.gif';
import { ShowProfile } from '../store/userProfile/getProfile';

const NewWallbookForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 500;
  const remainingChars = maxLength - text.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please write something before posting');
      return;
    }

    if (text.length > maxLength) {
      setError(`Text must be ${maxLength} characters or less`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ text: text.trim() });
      setText('');
    } catch (err) {
      setError('Failed to post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (error) setError('');
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-slate-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
    >
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-gray-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Share Your Thoughts</h2>
        <p className="text-sm text-gray-400 mt-1">
          Express yourself to the world
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Text Area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
              className="w-full bg-slate-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-700/50 resize-none transition-all duration-200 min-h-[150px]"
              maxLength={maxLength}
              disabled={isSubmitting}
            />

            {/* Character Counter */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`text-xs font-medium ${
                  remainingChars < 50
                    ? remainingChars < 20
                      ? 'text-red-400'
                      : 'text-yellow-400'
                    : 'text-gray-500'
                }`}
              >
                {remainingChars}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 disabled:border-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Post Wallbook</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Footer Tip */}
      <div className="bg-slate-900/60 border-t border-gray-800 px-6 py-3">
        <p className="text-xs text-gray-500 text-center">
          Your thoughts will be visible to everyone on the platform
        </p>
      </div>
    </motion.div>
  );
};

// SVG Lines connecting wallbooks
const WebConnections = React.memo(({ wallbooks, containerRef }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (!containerRef.current || wallbooks.length < 2) return;

    const updateConnections = () => {
      const cards = containerRef.current.querySelectorAll('[data-wallbook-id]');
      const newConnections = [];

      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          const rect1 = card.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const connectTo = Math.min(
            index + 1 + Math.floor(Math.random() * 2),
            cards.length - 1
          );
          const card2 = cards[connectTo];
          const rect2 = card2.getBoundingClientRect();

          newConnections.push({
            x1: rect1.left + rect1.width / 2 - containerRect.left,
            y1: rect1.top + rect1.height / 2 - containerRect.top,
            x2: rect2.left + rect2.width / 2 - containerRect.left,
            y2: rect2.top + rect2.height / 2 - containerRect.top,
            id: `${index}-${connectTo}`,
          });
        }
      });

      setConnections(newConnections);
    };

    updateConnections();
    const interval = setInterval(updateConnections, 100);
    return () => clearInterval(interval);
  }, [wallbooks, containerRef]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {connections.map((conn) => (
        <motion.line
          key={conn.id}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="rgba(147, 51, 234, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </svg>
  );
});

WebConnections.displayName = 'WebConnections';

// Floating Wallbook
const FloatingWallbook = React.memo(
  ({ wallbook, index, totalCards, isMobile }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Close menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleViewProfile = async (e) => {
      let userId = e._id;
      await dispatch(ShowProfile({ userId }));
      navigate('/Profilia');
      setMenuOpen(false);
    };

    // Calculate non-overlapping positions
    const getPosition = () => {
      const cols = isMobile ? 2 : 4;
      const rows = Math.ceil(totalCards / cols);
      const col = index % cols;
      const row = Math.floor(index / cols);

      const leftMargin = isMobile ? 5 : 15;
      const availableWidth = isMobile ? 90 : 80;

      const baseLeft = (col / cols) * availableWidth + leftMargin;
      const baseTop = (row / rows) * 70 + 10;

      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;

      return {
        left: `${Math.max(
          leftMargin,
          Math.min(95 - (isMobile ? 10 : 5), baseLeft + offsetX)
        )}%`,
        top: `${Math.max(10, Math.min(80, baseTop + offsetY))}%`,
      };
    };

    const position = useMemo(
      () => getPosition(),
      [index, totalCards, isMobile]
    );

    return (
      <motion.div
        data-wallbook-id={wallbook.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: [0, Math.sin(index * 0.5) * 15, 0],
          y: [0, Math.cos(index * 0.3) * 15, 0],
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.6,
          delay: index * 0.05,
          x: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 w-64 md:w-72"
        style={{
          left: position.left,
          top: position.top,
          zIndex: 10 + (index % 10),
        }}
      >
        <p className="text-gray-100 text-sm leading-relaxed mb-3 line-clamp-4">
          {wallbook.text}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="font-medium text-purple-300 truncate">
            @{wallbook.author}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px]">
              {new Date(wallbook.timestamp).toLocaleTimeString()}
            </span>

            {/* Three-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 hover:bg-gray-700/50 rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 z-50 min-w-[140px]">
                  <button
                    onClick={() => handleViewProfile(wallbook.userId)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

FloatingWallbook.displayName = 'FloatingWallbook';

const HomePage = () => {
  const [wallbooks, setWallbooks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedData = useSelector((state) => state.Iliana?.feed);

  // Determine items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      if (width < 640) setItemsPerPage(4);
      else if (width < 1024) setItemsPerPage(6);
      else setItemsPerPage(8);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(wallbooks.length / itemsPerPage),
    [wallbooks.length, itemsPerPage]
  );

  const currentWallbooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return wallbooks.slice(startIndex, startIndex + itemsPerPage);
  }, [wallbooks, currentPage, itemsPerPage]);

  useEffect(() => setCurrentPage(1), [wallbooks.length]);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthClick = useCallback(() => {
    const token = localStorage.getItem('auth');
    if (token) {
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
      localStorage.removeItem('noob');
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(thought());
  }, [dispatch]);

  useEffect(() => {
    if (feedData?.thoughts?.length > 0) {
      const mappedWallbooks = feedData.thoughts.map((item) => ({
        id: item._id,
        userId: item.userId,
        text: item.content,
        author: item.userId?.username || 'Anonymous',
        timestamp: new Date(item.createdAt),
      }));
      setWallbooks(mappedWallbooks);
      setIsLoading(false);
    } else if (feedData && feedData.thoughts?.length === 0) {
      setIsLoading(false);
    }
  }, [feedData]);

  const handleCreateWallbook = useCallback(
    async (data) => {
      const token = localStorage.getItem('auth');
      if (!token) {
        alert('Please login to post a thought');
        return;
      }
      try {
        const result = await dispatch(
          createThought({ token, content: data.text })
        );
        if (createThought.fulfilled.match(result)) {
          setShowCreateModal(false);
          await dispatch(thought());
        } else {
          alert('Failed to post thought. Please try again.');
        }
      } catch (error) {
        alert('An error occurred while posting.');
      }
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
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
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 border border-gray-700"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">
                    Log Out
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">
                    Sign In
                  </span>
                </>
              )}
            </button>
          </motion.div>
        </nav>
      </header>

      <div
        ref={containerRef}
        className="relative min-h-screen pt-20 pb-32 md:pb-20"
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[80vh]"
          >
            <img
              src={chica}
              alt="Loading"
              className="max-w-xs md:max-w-md object-contain"
            />
          </motion.div>
        ) : wallbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <BookOpen className="w-20 h-20 text-gray-600 mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              No Wallbooks Yet
            </h3>
            <p className="text-gray-400 text-center">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <>
            <WebConnections
              wallbooks={currentWallbooks}
              containerRef={containerRef}
            />
            <div className="relative w-full h-[calc(100vh-12rem)]">
              <AnimatePresence mode="wait">
                {currentWallbooks.map((wallbook, index) => (
                  <FloatingWallbook
                    key={wallbook.id}
                    wallbook={wallbook}
                    index={index}
                    totalCards={currentWallbooks.length}
                    isMobile={isMobile}
                  />
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-800 z-40">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <motion.button
        onClick={() => setShowCreateModal(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-gradient-to-r from-slate-800 to-black hover:from-slate-700 hover:to-black text-white rounded-full p-3 md:p-4 shadow-2xl z-40"
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
                className="absolute -top-4 -right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10"
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
