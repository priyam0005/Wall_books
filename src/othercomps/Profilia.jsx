import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { connected } from '../store/userProfile/connect';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Friends } from '../store/Friends/newFriend';
import { BookOpen, Users, Loader2, ArrowLeft } from 'lucide-react';
import { friends } from '../store/Friends/friends';
import { ShowProfile } from '../store/userProfile/getProfile';
import { getUserThoughts } from '../store/thoughts/mythought';

// Loading Component
const ProfileLoader = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto" />
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Loading Profile</h2>
          <p className="text-gray-400 text-sm">
            Please wait while we fetch the data...
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
        <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('about');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wallbooks, setWallbooks] = useState([]);
  const [wallbooksLoading, setWallbooksLoading] = useState(true);
  const [wallbookColor, setWallbookColor] = useState('#1db954');

  const token = localStorage.getItem('auth');
  const user = useSelector((state) => state.Profile.UserProfile);
  const { response } = useSelector((state) => state.connect);
  const { list } = useSelector((state) => state.mitra);
  const mylove = useSelector((state) => state.Mi?.thoughts || []);

  const users = user?.data?.[0];
  const friendId = users?.userId?._id;
  const User = list?.data || [];

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

  const yours = async () => {
    try {
      const resultAction = await dispatch(Friends({ id: friendId }));
      if (Friends.fulfilled.match(resultAction)) {
        console.log('✅ Friend list loaded');
      }
    } catch (error) {
      console.error('❌ Error loading friends:', error);
    }
  };

  const Iliana = async () => {
    setWallbooksLoading(true);
    try {
      const result = await dispatch(
        getUserThoughts({ userId: friendId, token })
      );

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

  const handleClick = async () => {
    if (requestSent || connecting) {
      return;
    }

    const Reciever_Id = users.userId._id;
    setConnecting(true);

    try {
      const result = await dispatch(connected({ token, Reciever_Id }));

      if (connected.fulfilled.match(result)) {
        setRequestSent(true);
        toast.success('Request sent successfully');
      } else {
        toast.error('Failed to send request');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error sending request:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleMessage = () => alert('Opening chat... 💬');

  const handlecclick = async (e) => {
    let userId = e;
    await dispatch(ShowProfile({ userId }));
    navigate('/profilia');
  };

  const ours = async (e) => {
    setWallbookColor(e);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);

      try {
        if (users && friendId) {
          await yours();
          await Iliana();
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    loadProfile();
  }, [dispatch, friendId]);

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

  if (isLoading || !users) {
    return <ProfileLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 24,
          left: 20,
          right: 20,
          maxWidth: 'calc(100vw - 40px)',
          margin: '0 auto',
          pointerEvents: 'none',
        }}
        toastOptions={{
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '16px 20px',
            borderRadius: '12px',
            minWidth: '280px',
            maxWidth: '90vw',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            fontSize: '1rem',
            lineHeight: '1.25',
            fontWeight: '500',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(45, 55, 72, 0.9)',
            color: '#E2E8F0',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            gap: '8px',
            transition: 'all 0.3s ease-out',
          },
          duration: 3500,
          success: {
            icon: '🎉',
            iconTheme: {
              primary: '#48BB78',
              secondary: '#1A202C',
            },
            style: {
              backgroundColor: 'rgba(56, 161, 105, 0.9)',
              color: '#FFFFFF',
              boxShadow: '0 8px 16px rgba(30, 90, 50, 0.4)',
            },
          },
          error: {
            icon: '🚨',
            iconTheme: {
              primary: '#F56565',
              secondary: '#1A202C',
            },
            style: {
              backgroundColor: 'rgba(229, 62, 62, 0.9)',
              color: '#FFFFFF',
              boxShadow: '0 8px 16px rgba(180, 40, 40, 0.4)',
            },
          },
        }}
      />

      {/* Header - matching main profile */}
      <header className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors mr-2"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <BookOpen className="text-purple-400 w-6 h-6 md:w-7 md:h-7" />
            <h1 className="text-lg md:text-xl font-bold text-white">
              Wallbooks
            </h1>
          </div>
        </nav>
      </header>

      {/* Main Profile Section */}
      <div className="max-w-4xl mt-16 mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-800/90 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 border border-gray-800/50 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={users.profilePic}
                alt={users.displayName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-xl border-2 border-gray-700/50"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-1">
                  {users.displayName}
                </h1>
                <p className="text-gray-400 text-sm">
                  @{users.userId.username}
                </p>
              </div>

              {/* Bio */}
              {users.bio && (
                <div className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/30">
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                    {users.bio}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={handleClick}
                  disabled={connecting || requestSent}
                  className={`flex-1 rounded-xl py-3 text-white font-semibold transition shadow-lg ${
                    connecting || requestSent
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-green-500/30'
                  }`}
                >
                  {connecting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </span>
                  ) : requestSent ? (
                    'Request Sent ✓'
                  ) : (
                    'Connect'
                  )}
                </button>

                <button
                  onClick={handleMessage}
                  className="flex-1 py-3 rounded-xl border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold transition shadow-lg hover:shadow-blue-500/30"
                >
                  Message
                </button>
              </div>
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
                    Friends ({User?.length || 0})
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
                        onClick={() => ours(theme.color)}
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
                    <div
                      key={wallbook._id || index}
                      className="p-4 rounded-lg border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer group"
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
                      <div className="flex flex-col h-full">
                        <div
                          className="text-2xl mb-2 opacity-50 group-hover:opacity-70 transition-opacity"
                          style={{ color: wallbookColor }}
                        >
                          "
                        </div>
                        <p className="text-sm leading-relaxed mb-3 flex-grow text-gray-200">
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
                              ? new Date(
                                  wallbook.createdAt
                                ).toLocaleDateString()
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
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

        {activeTab === 'friends' && (
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Friends ({User?.length || 0})
              </h3>
              {User?.length > 8 && (
                <button
                  onClick={() => setShowAllFriends(!showAllFriends)}
                  className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                >
                  {showAllFriends ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {User && User.length > 0 ? (
                (showAllFriends ? User : User.slice(0, 8)).map((friend) => (
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
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center py-4 border-t border-gray-800/50">
        <p className="text-sm text-gray-400">
          Designed and Managed by{' '}
          <span className="font-bold text-fuchsia-500">PRIYAM PATHAK</span>
        </p>
      </footer>
    </div>
  );
}
