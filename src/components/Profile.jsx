import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowProfile } from '../store/userProfile/getProfile';
import axios from 'axios';
import { userProfile } from '../store/userProfile/MyProfile';
import LoadingPage from '../othercomps/loadingComp/loading';
import { friends } from '../store/Friends/friends';
import { BookOpen } from 'lucide-react';

import {
  Instagram,
  Twitter,
  Youtube,
  Globe,
  MapPin,
  Calendar,
  Camera,
  MoreHorizontal,
  Share,
  Headphones,
  Users,
  Edit3,
  MessageCircle,
  UserCheck,
  Settings,
} from 'lucide-react';
import { list } from 'postcss';

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
  interests: [
    { name: 'Music Production', icon: '🎵', count: 12 },
    { name: 'Gaming', icon: '🎮', count: 8 },
    { name: 'Photography', icon: '📸', count: 15 },
    { name: 'Tech Reviews', icon: '📱', count: 6 },
    { name: 'Travel', icon: '✈️', count: 22 },
    { name: 'Coffee', icon: '☕', count: 5 },
    { name: 'Coding', icon: '💻', count: 18 },
    { name: 'Movies', icon: '🎬', count: 9 },
  ],

  wallbooks: [
    {
      quote: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      date: 'Oct 2024',
    },
    {
      quote: "Code is like humor. When you have to explain it, it's bad.",
      author: 'Cory House',
      date: 'Sep 2024',
    },
    {
      quote: 'First, solve the problem. Then, write the code.',
      author: 'John Johnson',
      date: 'Aug 2024',
    },
    {
      quote: 'Experience is the name everyone gives to their mistakes.',
      author: 'Oscar Wilde',
      date: 'Jul 2024',
    },
  ],

  currentlyPlaying: {
    song: 'Midnight City',
    artist: 'M83',
    platform: 'Spotify',
  },
};

export default function GenZProfileImproved() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const dispatch = useDispatch();
  const handleConnect = () => alert('Connection request sent! 🚀');
  const handleMessage = () => alert('Opening chat... 💬');
  const handleFollow = () => setIsFollowing(!isFollowing);

  const color = localStorage.getItem('color');

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
  console.log(token);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const edit = () => {
    navigate('/updateProfile');
  };

  const [state, setState] = useState(false);
  let { list } = useSelector((state) => state.dost);
  console.log(list);

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
        console.log('the request got rejeceted');
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
    let userId = e;
    console.log(e);
    await dispatch(ShowProfile({ userId }));
    navigate('/profilia');
  };

  const MyProfile = JSON.parse(localStorage.getItem('noob'));

  console.log(MyProfile);
  useEffect(() => {
    mine(), yours();
  }, [token]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen space-y-5 bg-gradient-to-br from-gray-900 via-black to-gray-800  text-white">
      <div className="flex items-center justify-center h-24 bg-gradient-to-br from-black via-gray-900 to-black">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl relative">
          Welcome To SocialNet
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse -z-10"></div>
        </h2>
      </div>
      {/* Main Profile Section */}
      <div className="max-w-5xl mx-auto px-1 rounded-3xl relative z-10">
        <div className="flex flex-col lg:flex-col gap-6">
          {/* Left Column - Main Profile */}
          <div className="w-full rounded-xl flex justify-between">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 -solid rounded-lg -[#222222] flex flex-col md:flex-row md:space-x-8 p-4 md:p-6 mb-4 w-full">
              {/* Avatar & Basic Info */}
              <div className="relative mb-6 flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={MyProfile?.profilePic}
                  alt="profile pic"
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover -black shadow-lg"
                />
                <button
                  onClick={edit}
                  className="absolute bottom-2 right-2 p-2 bg-[#3b82f6] hover:bg-[#2563eb] transition rounded-full"
                >
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 flex-1">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <h1 className="text-xl  font-serif md:text-2xl text-fuchsia-400 font-bold">
                    {MyProfile?.displayName}
                  </h1>
                </div>
                <p className="text-[#888888] text-sm font-mono  md:text-left">
                  @{MyProfile?.userId.username}
                </p>

                {/* Bio */}
                <p className="text-base md:text-lg text-bold text-green leading-relaxed  md:text-left">
                  {MyProfile?.bio}
                </p>

                {/* Status */}
                <div className="p-3 bg-[#0a0a0a] -l-4 -[#8b5cf6]">
                  <p className="text-sm text-[#cccccc]">{mockProfile.status}</p>
                </div>

                {/* Location & Join Date */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-[#888888] pb-6 -b -[#222222]">
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
                    onClick={handleConnect}
                    className="w-full rounded-3xl py-3 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:from-[#2563eb] hover:to-[#7c3aed] text-white font-semibold transition"
                  >
                    Connect
                  </button>
                  <div className="flex gap-2 rounded-lg">
                    <button
                      onClick={handleMessage}
                      className="flex-1 py-2  rounded-2xl -[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white font-medium transition text-sm md:text-base"
                    >
                      Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`flex-1 rounded-2xl py-2  font-medium transition text-sm md:text-base ${
                        isFollowing
                          ? '-[#888888] text-[#888888] hover:-red-500 hover:text-red-500'
                          : '-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white'
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
            <div className="bg-[#111111] rounded-lg -[#222222] mb-6">
              <div className="flex">
                {['about', 'friends'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 text-sm font-semibold capitalize -b-2 transition flex-1 ${
                      activeTab === tab
                        ? '-[#3b82f6] text-[#3b82f6]'
                        : '-transparent text-[#888888] hover:text-white'
                    }`}
                  >
                    {tab === 'friends' ? (
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Friends ({list.length})
                      </span>
                    ) : (
                      tab
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#1db954]" />
                      <h3 className="text-lg font-semibold">Wallbooks</h3>
                      <span className="text-sm text-[#888888]">
                        ({mockProfile.wallbooks.length})
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
                            onClick={() => {
                              setWallbookColor(theme.color);
                              ours(theme.color);
                            }}
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
                    {mockProfile.wallbooks.map((wallbook, index) => (
                      <div
                        key={index}
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
                            {wallbook.quote}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#888888]/20">
                            <span
                              className="text-xs font-medium"
                              style={{ color: wallbookColor }}
                            >
                              {wallbook.author}
                            </span>
                            <span className="text-xs text-[#888888]">
                              {wallbook.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'friends' && state == true && (
              <div className="bg-[#111111] rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Friends ({list.length})
                  </h3>
                  <button
                    onClick={() => setShowAllFriends(!showAllFriends)}
                    className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                  >
                    {showAllFriends ? 'Show Less' : 'View All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {list.map((friend) => (
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
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} border-2 border-[#0a0a0a] rounded-full transition-transform group-hover:scale-110`}
                          />
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                            {friend?.displayName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {state == false && <LoadingPage />}
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
              <span className="text-md font-bold text-fuchsia-500 ml-2 ">
                PRIYAM PATHAK
              </span>
            </p>
            <div className="flex justify-center space-x-2"></div>
          </div>
        </aside>
      </footer>
    </div>
  );
}
