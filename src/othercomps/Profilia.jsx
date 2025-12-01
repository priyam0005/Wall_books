import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { connected } from '../store/userProfile/connect';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Friends } from '../store/Friends/newFriend';
import {
  Instagram,
  Twitter,
  Youtube,
  Globe,
  MapPin,
  Calendar,
  Users,
  Headphones,
  Loader2,
} from 'lucide-react';
import { friends } from '../store/Friends/friends';
import { ShowProfile } from '../store/userProfile/getProfile';

const mockProfile = {
  name: 'Alex Chen',
  handle: '@alexch3n',
  avatar: 'https://i.pravatar.cc/150?img=12',
  coverImage:
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop',
  location: 'Mumbai, India',
  joinedDate: 'March 2023',
  verified: true,
  about:
    'Digital creator & tech enthusiast. Building cool stuff and vibing with the community. Love connecting with creative minds! 🚀',
  status: 'Currently listening to Lo-Fi beats 🎵',
  stats: {
    following: 247,
    followers: 1204,
    posts: 89,
  },
  socials: {
    instagram: 'alexch3n',
    twitter: 'alexch3n_',
    youtube: 'alexchen',
    website: 'alexchen.dev',
  },
  interests: [],
  friends: [],
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
        {/* Animated Spinner */}
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Loading Profile
          </h2>
          <p className="text-gray-400 text-sm">
            Please wait while we fetch the data...
          </p>
        </div>

        {/* Loading Progress Dots */}
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

        {/* Shimmer Card Preview */}
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

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [req, setreq] = useState();
  const [isLoading, setIsLoading] = useState(true); // NEW: Loading state

  const token = localStorage.getItem('auth');
  const user = useSelector((state) => state.Profile.UserProfile);
  const { response } = useSelector((state) => state.connect);
  const { list } = useSelector((state) => state.mitra);

  const users = user?.data?.[0];
  const friendId = users?.userId?._id;
  const User = list?.data || [];

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

  const handleClick = async () => {
    const Reciever_Id = users.userId._id;
    const result = await dispatch(connected({ token, Reciever_Id }));

    setConnecting(true);

    if (connected.fulfilled.match(result)) {
      setConnecting(false);
    }

    setreq(response);
    toast.success('Request sent successfully');
  };

  const handleMessage = () => alert('Opening chat... 💬');
  const handleFollow = () => setIsFollowing(!isFollowing);

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

  const handlecclick = async (e) => {
    let userId = e;
    await dispatch(ShowProfile({ userId }));
    navigate('/profilia');
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);

      try {
        // Wait for profile data to load
        if (users && friendId) {
          await yours();
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        // Add minimum loading time for better UX (optional)
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    loadProfile();
  }, [dispatch, friendId]);

  // Show loader while data is loading
  if (isLoading || !users) {
    return <ProfileLoader />;
  }

  return (
    <div className="min-h-screen space-y-5 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="flex items-center justify-center h-32 bg-gradient-to-br from-black via-gray-900 to-black">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl relative">
          Welcome To SocialNet
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse -z-10"></div>
        </h1>
      </div>

      {req === true && (
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
      )}

      {/* Main Profile Section */}
      <div className="max-w-5xl mx-auto px-1 rounded-3xl relative z-10">
        <div className="flex flex-col lg:flex-col gap-6">
          {/* Left Column - Main Profile */}
          <div className="w-full rounded-xl flex justify-between">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-solid rounded-lg border-[#222222] flex flex-col md:flex-row md:space-x-8 p-4 md:p-6 mb-4 w-full">
              {/* Avatar & Basic Info */}
              <div className="relative mb-6 flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={users.profilePic}
                  alt={users.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover border-black shadow-lg"
                />
              </div>

              <div className="flex flex-col space-y-3 flex-1">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <h1 className="text-xl md:text-2xl font-bold">
                    {users.displayName}
                  </h1>
                  {mockProfile.verified && (
                    <div className="w-5 h-5 bg-[#3b82f6] flex items-center justify-center">
                      <span className="text text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-[#888888] text-sm font-mono md:text-left">
                  @{users.userId.username}
                </p>

                {/* Bio */}
                <p className="text-base md:text-lg text-bold text-green leading-relaxed md:text-left">
                  {users.bio}
                </p>

                {/* Status */}
                <div className="p-3 bg-[#0a0a0a] border-l-4 border-[#8b5cf6]">
                  <p className="text-sm text-[#cccccc]">{mockProfile.status}</p>
                </div>

                {/* Location & Join Date */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-[#888888] pb-6 border-b border-[#222222]">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    {mockProfile.location}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    Joined {mockProfile.joinedDate}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleClick}
                    disabled={connecting}
                    className={`w-full rounded-3xl py-3 text-white font-semibold transition ${
                      connecting
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed]'
                    }`}
                  >
                    {connecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>

                  <div className="flex gap-2 rounded-lg">
                    <button
                      onClick={handleMessage}
                      className="flex-1 py-2 border rounded-2xl border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white font-medium transition text-sm md:text-base"
                    >
                      Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`flex-1 rounded-2xl py-2 border font-medium transition text-sm md:text-base ${
                        isFollowing
                          ? 'border-[#888888] text-[#888888] hover:border-red-500 hover:text-red-500'
                          : 'border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full">
            {/* Navigation Tabs */}
            <div className="bg-[#111111] border border-[#222222] mb-6">
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

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="mb-6 p-4 bg-gradient-to-r from-[#1db954]/10 to-[#1db954]/5 border-l-4 border-[#1db954]">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4 text-[#1db954]" />
                    <span className="text-sm font-medium">Now Playing</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {mockProfile.currentlyPlaying.song}
                    </div>
                    <div className="text-xs text-[#888888]">
                      {mockProfile.currentlyPlaying.artist}
                    </div>
                    <div className="text-xs text-[#1db954] mt-1">
                      {mockProfile.currentlyPlaying.platform}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Connect Elsewhere
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://instagram.com/${mockProfile.socials.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-[#0a0a0a] hover:bg-[#222222] transition text-sm border border-[#222222] hover:border-[#e4405f]"
                    >
                      <Instagram className="w-4 h-4 text-[#e4405f]" />
                      Instagram
                    </a>
                    <a
                      href={`https://twitter.com/${mockProfile.socials.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-[#0a0a0a] hover:bg-[#222222] transition text-sm border border-[#222222] hover:border-[#1da1f2]"
                    >
                      <Twitter className="w-4 h-4 text-[#1da1f2]" />
                      Twitter
                    </a>
                    <a
                      href={`https://youtube.com/${mockProfile.socials.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-[#0a0a0a] hover:bg-[#222222] transition text-sm border border-[#222222] hover:border-[#ff0000]"
                    >
                      <Youtube className="w-4 h-4 text-[#ff0000]" />
                      YouTube
                    </a>
                    <a
                      href={mockProfile.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-[#0a0a0a] hover:bg-[#222222] transition text-sm border border-[#222222] hover:border-[#3b82f6]"
                    >
                      <Globe className="w-4 h-4 text-[#3b82f6]" />
                      Website
                    </a>
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
                  {User?.map((friend) => (
                    <div key={friend.userId}>
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="relative cursor-pointer"
                          onClick={() => handlecclick(friend.userId)}
                        >
                          <img
                            src={friend?.profilePic}
                            alt={friend?.displayName}
                            className="w-32 h-32 rounded-xl hover:border-2 hover:border-blue-500 object-cover transition"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                              'online'
                            )} border-2 border-[#0a0a0a] rounded-full`}
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">
                            {friend?.displayName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
