import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Plus, X, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thought } from '../store/thoughts/getThought';
import { createThought } from '../store/thoughts/createThought';
import chica from '../assets/chica.gif';

// Memoized WallbookCard component with grid-based positioning
const WallbookCard = React.memo(({ wallbook, index, onToggleLike }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 flex flex-col justify-between h-full"
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
      <Heart
        className={`w-5 h-5 ${wallbook.liked ? 'fill-current' : 'stroke-current'}`}
      />
      <span>{wallbook.likes}</span>
    </button>
  </motion.div>
));

WallbookCard.displayName = 'WallbookCard';

// Memoized form component
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

  const handleTextChange = useCallback((e) => {
    setFormData({ text: e.target.value });
  }, []);

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
          onChange={handleTextChange}
          placeholder="Share your thoughts here..."
          className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/60 transition-shadow duration-300 ${
            errors.text ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-700'
          }`}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-500 font-semibold">{errors.text}</p>
        )}
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
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const feedData = useSelector((state) => state.Iliana?.feed);

  // Determine items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(4); // Mobile: 4 items
      else if (width < 1024) setItemsPerPage(6); // Tablet: 6 items
      else setItemsPerPage(9); // Desktop: 9 items
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Pagination calculations
  const totalPages = useMemo(() => 
    Math.ceil(wallbooks.length / itemsPerPage),
    [wallbooks.length, itemsPerPage]
  );

  const currentWallbooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return wallbooks.slice(startIndex, endIndex);
  }, [wallbooks, currentPage, itemsPerPage]);

  // Reset to page 1 when wallbooks change
  useEffect(() => {
    setCurrentPage(1);
  }, [wallbooks.length]);

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

  const handleAddClick = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

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
      prev.map((w) => {
        if (w.id === id) {
          const liked = !w.liked;
          const likes = liked ? w.likes + 1 : w.likes - 1;
          return { ...w, liked, likes };
        }
        return w;
      })
    );
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const headerContent = useMemo(() => (
    <header className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
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
  ), [isAuthenticated, handleAuthClick]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {headerContent}

      <div className="relative pt-20 pb-32 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <img src={chica} alt="Loading" className="max-w-xs md:max-w-md object-contain" />
          </motion.div>
        ) : wallbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <BookOpen className="w-20 h-20 text-gray-600 mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Wallbooks Yet</h3>
            <p className="text-gray-400 text-center">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <AnimatePresence mode="wait">
                {currentWallbooks.map((wallbook, index) => (
                  <WallbookCard
                    key={wallbook.id}
                    wallbook={wallbook}
                    index={index}
                    onToggleLike={toggleLike}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-700"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-700"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-4 text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, wallbooks.length)} of {wallbooks.length} wallbooks
            </div>
          </>
        )}
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
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={handleCloseModal}
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
