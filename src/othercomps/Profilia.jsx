import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { connected } from '../store/userProfile/connect';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Friends } from '../store/Friends/newFriend';
import { BookOpen, Users, Headphones, Loader2 } from 'lucide-react';
import { friends } from '../store/Friends/friends';
import { ShowProfile } from '../store/userProfile/getProfile';
import { getUserThoughts } from '../store/thoughts/mythought';

const mockProfile = {
  status: 'Currently listening to Lo-Fi beats 🎵',
  currentlyPlaying: {
    song: 'Midnight City',
    artist: 'M83',
    platform: 'Spotify',
  },
};

// Loading Component
const ProfileLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Loading Profile
          </h2>
          <p className="text-gray-400 text-sm">
            Please wait while we fetch the data...
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
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

export default function GenZProfileImproved() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('about');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // Track if request was sent
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
    // Prevent multiple clicks if request already sent
    if (requestSent || connecting) {
      return;
    }

    const Reciever_Id = users.userId._id;
    setConnecting(true);

    try {
      const result = await dispatch(connected({ token, Reciever_Id }));

      if (connected.fulfilled.match(result)) {
        setRequestSent(true); // Mark request as sent
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
    <div className="min-h-screen space-y-5 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Move Toaster outside conditional rendering */}
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

      <div className="flex items-center justify-center h-24 bg-gradient-to-br from-black via-gray-900 to-black">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl relative">
          Welcome To SocialNet
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse -z-10"></div>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-1 rounded-3xl relative z-10">
        <div className="flex flex-col lg:flex-col gap-6">
          <div className="w-full rounded-xl flex justify-between">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg flex flex-col md:flex-row md:space-x-8 p-4 md:p-6 mb-4 w-full">
              <div className="relative mb-6 flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={users.profilePic}
                  alt={users.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-lg"
                />
              </div>

              <div className="flex flex-col space-y-3 flex-1">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <h1 className="text-xl font-serif md:text-2xl text-fuchsia-400 font-bold">
                    {users.displayName}
                  </h1>
                </div>
                <p className="text-[#888888] text-sm font-mono md:text-left">
                  @{users.userId.username}
                </p>

                <p className="text-base md:text-lg text-bold text-green leading-relaxed md:text-left">
                  {users.bio}
                </p>

                <div className="p-3 bg-[#0a0a0a]">
                  <p className="text-sm text-[#cccccc]">{mockProfile.status}</p>
                </div>

                <div className="flex flex-col space-y-4 mt-6">
                  <button
                    onClick={handleClick}
                    disabled={connecting || requestSent}
                    className={`w-full rounded-3xl py-3 text-white font-semibold transition shadow-lg ${
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
                    className="w-full py-3 rounded-2xl border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white font-medium transition text-sm md:text-base"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="bg-[#111111] rounded-lg mb-6">
              <div className="flex">
                {['about', 'friends'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 text-sm font-semibold capitalize border-b-2 transition flex-1 ${
                      activeTab === tab
                        ? 'border-[#3b82f6] text-[#3b82f6]'
                        : 'border-transparent text-[#888888] hover:text-white'
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

            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#1db954]" />
                      <h3 className="text-lg font-semibold">Wallbooks</h3>
                      <span className="text-sm text-[#888888]">
                        ({wallbooks?.length || 0})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#888888]">Theme:</span>
                      <div className="flex gap-2">
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
                            className={`w-6 h-6 rounded-full transition-all ${
                              wallbookColor === theme.color
                                ? 'ring-2 ring-offset-2 ring-offset-[#121212] ring-white scale-110'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: theme.color }}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wallbooksLoading ? (
                      <div className="col-span-2 text-center py-8 text-[#888888]">
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
                              className="text-2xl mb-3 opacity-50 group-hover:opacity-70 transition-opacity"
                              style={{ color: wallbookColor }}
                            >
                              "
                            </div>
                            <p className="text-sm leading-relaxed mb-3 flex-grow">
                              {wallbook.content}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#888888]/20">
                              <span
                                className="text-xs font-medium"
                                style={{ color: wallbookColor }}
                              >
                                {wallbook.username || 'Anonymous'}
                              </span>
                              <span className="text-xs text-[#888888]">
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
                      <div className="col-span-2 text-center py-8 text-[#888888]">
                        No thoughts yet. Start sharing your thoughts!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="bg-[#111111] rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Friends ({User?.length || 0})
                  </h3>
                  {User?.length > 8 && (
                    <button
                      onClick={() => setShowAllFriends(!showAllFriends)}
                      className="text-sm text-[#3b82f6] hover:text-[#2563eb]"
                    >
                      {showAllFriends ? 'Show Less' : 'View All'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {User && User.length > 0 ? (
                    User.map((friend) => (
                      <div key={friend.userId}>
                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                          <div
                            className="relative"
                            onClick={() => handlecclick(friend.userId)}
                          >
                            <img
                              src={friend?.profilePic}
                              alt={friend?.displayName}
                              className="w-32 h-32 rounded-xl object-cover border-2 border-[#333333] group-hover:border-blue-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                'online'
                              )} border-2 border-[#0a0a0a] rounded-full transition-transform group-hover:scale-110`}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                              {friend?.displayName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-[#888888]">
                      No friends yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 mb-0 self-center">
        <aside>
          <div className="mb-2 text-center">
            <p className="text-md mb-2">
              Designed and Managed by
              <span className="text-md font-bold text-fuchsia-500 ml-2">
                PRIYAM PATHAK
              </span>
            </p>
          </div>
        </aside>
      </footer>
    </div>
  );
}
