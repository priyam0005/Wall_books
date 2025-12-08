import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowProfile } from '../store/userProfile/getProfile';
import { userProfile } from '../store/userProfile/MyProfile';
import LoadingPage from '../othercomps/loadingComp/loading';
import { friends } from '../store/Friends/friends';
import { deleteThought } from '../store/thoughts/deleteThought';
import { updateThought } from '../store/thoughts/updateThought';
import {
  BookOpen,
  Users,
  Edit3,
  MoreVertical,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { getUserThoughts } from '../store/thoughts/mythought';
import { motion, AnimatePresence } from 'framer-motion';

// Edit Wallbook Form
const EditWallbookForm = React.memo(({ wallbook, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ text: wallbook.content });
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setIsSubmitting(true);
      await onSubmit(wallbook._id, formData.text);
      setIsSubmitting(false);
    },
    [formData, onSubmit, validate, wallbook._id]
  );

  return (
    <div className="max-w-lg w-full p-6 md:p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-purple-700/40 backdrop-blur-md">
      <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4 md:mb-6">
        Edit Wallbook
      </h2>
      <div className="mb-6 md:mb-8">
        <label
          htmlFor="edit-text"
          className="block text-gray-300 text-base md:text-lg font-semibold mb-2"
        >
          Your Wallbook
        </label>
        <textarea
          id="edit-text"
          rows={5}
          value={formData.text}
          onChange={(e) => setFormData({ text: e.target.value })}
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
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 md:py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-lg md:text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white text-lg md:text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
});

EditWallbookForm.displayName = 'EditWallbookForm';

// Delete Confirmation Modal
const DeleteConfirmationModal = React.memo(
  ({ wallbook, onConfirm, onCancel, isDeleting }) => {
    return (
      <div className="max-w-md w-full p-6 md:p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-red-700/40 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
          Delete Wallbook?
        </h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this wallbook? This action cannot be
          undone.
        </p>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p className="text-gray-100 text-sm italic line-clamp-3">
            "{wallbook.content}"
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-lg font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl text-white text-lg font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  }
);

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

// Wallbook Card Component with Three-Dot Menu
const WallbookCard = React.memo(
  ({ wallbook, index, wallbookColor, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showMenu]);

    return (
      <div
        key={wallbook._id || index}
        className="p-4 rounded-lg border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
        style={{
          background: `linear-gradient(to bottom right, ${wallbookColor}1A, ${wallbookColor}0D)`,
          borderLeftColor: wallbookColor,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(to bottom right, ${wallbookColor}26, ${wallbookColor}14)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `linear-gradient(to bottom right, ${wallbookColor}1A, ${wallbookColor}0D)`;
        }}
      >
        {/* Three dot menu button */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-40 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl overflow-hidden z-50"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(wallbook);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(wallbook);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col h-full">
          <div
            className="text-2xl mb-2 opacity-50 group-hover:opacity-70 transition-opacity"
            style={{ color: wallbookColor }}
          >
            "
          </div>
          <p className="text-sm leading-relaxed mb-3 flex-grow text-gray-200 pr-6">
            {wallbook.content}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-700/30">
            <span
              className="text-xs font-medium"
              style={{ color: wallbookColor }}
            >
              {wallbook.username || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-400">
              {wallbook.createdAt
                ? new Date(wallbook.createdAt).toLocaleDateString()
                : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

WallbookCard.displayName = 'WallbookCard';

export default function GenZProfileImproved() {
  const [activeTab, setActiveTab] = useState('about');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallbook, setSelectedWallbook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const color = localStorage.getItem('color');
  const [wallbooks, setWallbooks] = useState([]);
  const [wallbooksLoading, setWallbooksLoading] = useState(true);
  const [wallbookColor, setWallbookColor] = useState(color || '#1db954');

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const token = localStorage.getItem('auth');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const edit = () => {
    navigate('/updateProfile');
  };

  const [state, setState] = useState(false);
  const { list } = useSelector((state) => state.dost);

  const Na = JSON.parse(localStorage.getItem('user'));
  const userId = Na._id;

  const mylove = useSelector((state) => state.Mi?.thoughts || []);
  console.log(mylove);

  const Iliana = async () => {
    setWallbooksLoading(true);
    try {
      const result = await dispatch(getUserThoughts({ userId, token }));

      if (getUserThoughts.fulfilled.match(result)) {
        console.log('Thoughts fetched successfully:', result.payload);
        setWallbooksLoading(false);
      } else if (getUserThoughts.rejected.match(result)) {
        console.log('Error fetching thoughts');
        setWallbooksLoading(false);
      }
    } catch (error) {
      console.log('Error in Iliana:', error);
      setWallbooksLoading(false);
    }
  };

  const yours = async () => {
    try {
      const resultAction = await dispatch(friends({ token }));

      if (friends.fulfilled.match(resultAction)) {
        setLoading(false);
        console.log('we got the friend list');
      } else if (friends.pending.match(resultAction)) {
        console.log('wait working on it.....');
        setLoading(true);
      } else if (friends.rejected.match(resultAction)) {
        setLoading(false);
        console.log('there is some error kindly check it out ');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mine = async () => {
    try {
      const result = await dispatch(userProfile({ token }));
      if (userProfile.fulfilled.match(result)) {
        setLoading(false);
        setState(true);
        console.log('the request got sent');
      } else if (userProfile.pending.match(result)) {
        setLoading(true);
      } else if (userProfile.rejected.match(result)) {
        console.log('the request got rejected');
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const ours = async (e) => {
    console.log(e);
    localStorage.removeItem('color');
    localStorage.setItem('color', e);
  };

  const handlecclick = async (e) => {
    const clickedUserId = e;
    console.log(e);
    await dispatch(ShowProfile({ userId: clickedUserId }));
    navigate('/profilia');
  };

  const handleEditClick = useCallback((wallbook) => {
    setSelectedWallbook(wallbook);
    setShowEditModal(true);
  }, []);

  const handleDeleteClick = useCallback((wallbook) => {
    setSelectedWallbook(wallbook);
    setShowDeleteModal(true);
  }, []);

  const handleEditSubmit = useCallback(
    async (wallbookId, updatedText) => {
      console.log('Updating wallbook:', wallbookId);
      const token = localStorage.getItem('auth');
      if (!token) {
        alert('Please login to edit');
        return;
      }

      try {
        // Dispatch the updateThought action with correct parameters
        const resultAction = await dispatch(
          updateThought({
            thoughtId: selectedWallbook._id,
            thoughtData: updatedText,
            token,
          })
        );

        if (updateThought.fulfilled.match(resultAction)) {
          console.log('Wallbook updated successfully');
          // Refresh the thoughts
          await Iliana();
          setShowEditModal(false);
          setSelectedWallbook(null);
        } else if (updateThought.rejected.match(resultAction)) {
          alert('Failed to update wallbook. Please try again.');
        }
      } catch (error) {
        console.error('Error updating wallbook:', error);
        alert('An error occurred while updating.');
      }
    },
    [dispatch]
  );

  const handleDeleteConfirm = useCallback(async () => {
    const token = localStorage.getItem('auth');

    if (!token || !selectedWallbook) {
      alert('Please login to delete');
      return;
    }

    setIsDeleting(true);
    try {
      // Dispatch the deleteThought action with correct parameters
      const resultAction = await dispatch(
        deleteThought({
          token,
          thoughtId: selectedWallbook._id,
        })
      );

      if (deleteThought.fulfilled.match(resultAction)) {
        console.log('Wallbook deleted successfully');
        // Refresh the thoughts
        await Iliana();
        setShowDeleteModal(false);
        setSelectedWallbook(null);
      } else if (deleteThought.rejected.match(resultAction)) {
        alert('Failed to delete wallbook. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting wallbook:', error);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  }, [dispatch, selectedWallbook]);

  const MyProfile = JSON.parse(localStorage.getItem('noob'));

  useEffect(() => {
    const fetchData = async () => {
      await mine();
      await yours();
      await Iliana();
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('mylove value:', mylove);
    if (mylove && Array.isArray(mylove) && mylove.length > 0) {
      console.log('Setting wallbooks to:', mylove);
      setWallbooks(mylove);
      setWallbooksLoading(false);
    } else {
      setWallbooksLoading(false);
    }
  }, [mylove]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-6">
      {/* Header */}
      <div className="flex items-center justify-center h-16 mb-6">
        <h2 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl relative">
          Welcome To WallBooks
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse -z-10"></div>
        </h2>
      </div>

      {/* Main Profile Section */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-800/90 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 border border-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={MyProfile?.profilePic}
                alt="profile pic"
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-xl border-2 border-gray-700/50"
              />
              <button
                onClick={edit}
                className="absolute bottom-2 right-2 p-2 bg-[#3b82f6] hover:bg-[#2563eb] transition rounded-full shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-1">
                  {MyProfile?.displayName}
                </h1>
                <p className="text-gray-400 text-sm">
                  @{MyProfile?.userId.username}
                </p>
              </div>

              {/* Bio */}
              {MyProfile?.bio && (
                <div className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30">
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {MyProfile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl mb-6 border border-gray-800/50 overflow-hidden">
          <div className="flex">
            {['about', 'friends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize border-b-2 transition flex-1 ${
                  activeTab === tab
                    ? 'border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab === 'friends' ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Users className="w-4 h-4" />
                    Friends ({list?.length || 0})
                  </span>
                ) : (
                  tab
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            {/* Wallbooks Section */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1db954]" />
                  <h3 className="text-lg font-semibold">Wallbooks</h3>
                  <span className="text-sm text-gray-400">
                    ({wallbooks?.length || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    Theme:
                  </span>
                  <div className="flex gap-1.5">
                    {[
                      { name: 'green', color: '#1db954' },
                      { name: 'blue', color: '#3b82f6' },
                      { name: 'purple', color: '#a855f7' },
                      { name: 'orange', color: '#f97316' },
                      { name: 'pink', color: '#ec4899' },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setWallbookColor(theme.color);
                          ours(theme.color);
                        }}
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all ${
                          wallbookColor === theme.color
                            ? 'ring-2 ring-offset-2 ring-offset-black ring-white scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: theme.color }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {wallbooksLoading ? (
                  <div className="col-span-2 text-center py-8 text-gray-400">
                    Loading thoughts...
                  </div>
                ) : wallbooks && wallbooks.length > 0 ? (
                  wallbooks.map((wallbook, index) => (
                    <WallbookCard
                      key={wallbook._id || index}
                      wallbook={wallbook}
                      index={index}
                      wallbookColor={wallbookColor}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-400">
                    No thoughts yet. Start sharing your thoughts!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && state === true && (
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Friends ({list?.length || 0})
              </h3>
              {list && list.length > 8 && (
                <button
                  onClick={() => setShowAllFriends(!showAllFriends)}
                  className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                >
                  {showAllFriends ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {list && list.length > 0 ? (
                (showAllFriends ? list : list.slice(0, 8)).map((friend) => (
                  <div
                    key={friend.userId}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                    onClick={() => handlecclick(friend.userId)}
                  >
                    <div className="relative">
                      <img
                        src={friend?.profilePic}
                        alt={friend?.displayName}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-gray-700 group-hover:border-blue-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                          'online'
                        )} border-2 border-black rounded-full transition-transform group-hover:scale-110`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        {friend?.displayName}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-400">
                  No friends yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'friends' && state === false && <LoadingPage />}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center py-4 border-t border-gray-800/50">
        <p className="text-sm text-gray-400">
          Designed and Managed by{' '}
          <span className="font-bold text-fuchsia-500">PRIYAM PATHAK</span>
        </p>
      </footer>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedWallbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowEditModal(false);
              setSelectedWallbook(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWallbook(null);
                }}
                className="absolute -top-4 -right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <EditWallbookForm
                wallbook={selectedWallbook}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedWallbook(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedWallbook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedWallbook(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedWallbook(null);
                }}
                className="absolute -top-4 -right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <DeleteConfirmationModal
                wallbook={selectedWallbook}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedWallbook(null);
                }}
                isDeleting={isDeleting}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
