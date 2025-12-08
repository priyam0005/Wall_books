import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Plus, X, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thought } from '../store/thoughts/getThought';
import { createThought } from '../store/thoughts/createThought';
import chica from '../assets/chica.gif';

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
          
          // Connect to next 1-2 cards to create web effect
          const connectTo = Math.min(index + 1 + Math.floor(Math.random() * 2), cards.length - 1);
          const card2 = cards[connectTo];
          const rect2 = card2.getBoundingClientRect();

          newConnections.push({
            x1: rect1.left + rect1.width / 2 - containerRect.left,
            y1: rect1.top + rect1.height / 2 - containerRect.top,
            x2: rect2.left + rect2.width / 2 - containerRect.left,
            y2: rect2.top + rect2.height / 2 - containerRect.top,
            id: `${index}-${connectTo}`
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
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
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

// Floating Wallbook with smart positioning to avoid overlap
const FloatingWallbook = React.memo(({ wallbook, index, onToggleLike, totalCards, isMobile }) => {
  // Calculate non-overlapping positions using grid-based approach with randomization
  const getPosition = () => {
    const cols = isMobile ? 2 : 4;
    const rows = Math.ceil(totalCards / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Desktop: adjust to leave space on left (start from 15% instead of 5%)
    const leftMargin = isMobile ? 5 : 15;
    const availableWidth = isMobile ? 90 : 80;
    
    const baseLeft = (col / cols) * availableWidth + leftMargin;
    const baseTop = (row / rows) * 70 + 10;
    
    // Add small random offset to make it look natural but avoid overlap
    const offsetX = (Math.random() - 0.5) * 8;
    const offsetY = (Math.random() - 0.5) * 8;
    
    return {
      left: `${Math.max(leftMargin, Math.min(95 - (isMobile ? 10 : 5), baseLeft + offsetX))}%`,
      top: `${Math.max(10, Math.min(80, baseTop + offsetY))}%`
    };
  };

  const position = useMemo(() => getPosition(), [index, totalCards, isMobile]);

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
        x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 flex flex-col justify-between w-64 md:w-72"
      style={{
        left: position.left,
        top: position.top,
        zIndex: 10 + (index % 10),
      }}
    >
      <p className="text-gray-100 text-sm leading-relaxed mb-3 line-clamp-4">
        {wallbook.text}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
        <span className="font-medium text-purple-300 truncate">@{wallbook.author}</span>
        <span className="text-[10px]">{new Date(wallbook.timestamp).toLocaleTimeString()}</span>
      </div>
      <button
        onClick={() => onToggleLike(wallbook.id)}
        className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
          wallbook.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
        aria-label="Like"
      >
        <Heart className={`w-5 h-5 ${wallbook.liked ? 'fill-current' : 'stroke-current'}`} />
        <span>{wallbook.likes}</span>
      </button>
    </motion.div>
  );
});

FloatingWallbook.displayName = 'FloatingWallbook';

// Form component
const NewWallbookForm = React.memo(({ onSubmit }) => {
  const [formData, setFormData] = useState({ text: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.text.trim()) {
      newErrors.text = 'Wallbook text is required';
    } else if (formData.text.length < 10) {
      newErrors.text = 'Please enter at least 10 characters';
    } else if (formData.text.length > 250) {
      newErrors.text = 'Maximum 250 characters allowed';
    }
    return newErrors;
  }, [formData.text]);

  const handleSubmit = useCallback(async (e) => {
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
  }, [formData, onSubmit, validate]);

  return (
    <div className="max-w-lg w-full p-6 md:p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-purple-700/40 backdrop-blur-md">
      <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 md:mb-6">
        Share a Wallbook Thought
      </h2>
      <div className="mb-6 md:mb-8">
        <label htmlFor="text" className="block text-gray-300 text-base md:text-lg font-semibold mb-2">
          Your Wallbook
        </label>
        <textarea
          id="text"
          rows={5}
          value={formData.text}
          onChange={(e) => setFormData({ text: e.target.value })}
          placeholder="Share your thoughts here..."
          className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/60 transition-shadow duration-300 ${
            errors.text ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-700'
          }`}
        />
        {errors.text && <p className="mt-1 text-sm text-red-500 font-semibold">{errors.text}</p>}
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white text-lg md:text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Posting...' : 'Post Your Wallbook'}
      </button>
    </div>
  );
});

NewWallbookForm.displayName = 'NewWallbookForm';

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

  const totalPages = useMemo(() => Math.ceil(wallbooks.length / itemsPerPage), [wallbooks.length, itemsPerPage]);
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
        text: item.content,
        author: item.userId?.username || 'Anonymous',
        timestamp: new Date(item.createdAt),
        likes: item.likeCount || 0,
        liked: false,
      }));
      setWallbooks(mappedWallbooks);
      setIsLoading(false);
    } else if (feedData && feedData.thoughts?.length === 0) {
      setIsLoading(false);
    }
  }, [feedData]);

  const handleCreateWallbook = useCallback(async (data) => {
    const token = localStorage.getItem('auth');
    if (!token) {
      alert('Please login to post a thought');
      return;
    }
    try {
      const result = await dispatch(createThought({ token, content: data.text }));
      if (createThought.fulfilled.match(result)) {
        setShowCreateModal(false);
        await dispatch(thought());
      } else {
        alert('Failed to post thought. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while posting.');
    }
  }, [dispatch]);

  const toggleLike = useCallback((id) => {
    setWallbooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 } : w))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-2">
            <BookOpen className="text-purple-400 w-6 h-6 md:w-7 md:h-7" />
            <h1 className="text-lg md:text-xl font-bold text-white">Wallbooks</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 border border-gray-700"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">Log Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">Sign In</span>
                </>
              )}
            </button>
          </motion.div>
        </nav>
      </header>

      <div ref={containerRef} className="relative min-h-screen pt-20 pb-32 md:pb-20">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[80vh]">
            <img src={chica} alt="Loading" className="max-w-xs md:max-w-md object-contain" />
          </motion.div>
        ) : wallbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <BookOpen className="w-20 h-20 text-gray-600 mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Wallbooks Yet</h3>
            <p className="text-gray-400 text-center">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            <WebConnections wallbooks={currentWallbooks} containerRef={containerRef} />
            <div className="relative w-full h-[calc(100vh-12rem)]">
              <AnimatePresence mode="wait">
                {currentWallbooks.map((wallbook, index) => (
                  <FloatingWallbook
                    key={wallbook.id}
                    wallbook={wallbook}
                    index={index}
                    totalCards={currentWallbooks.length}
                    isMobile={isMobile}
                    onToggleLike={toggleLike}
                  />
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-800 z-40">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white font-medium">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
              <button onClick={() => setShowCreateModal(false)} className="absolute -top-4 -right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10">
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
