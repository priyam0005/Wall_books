import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowProfile } from '../store/userProfile/getProfile';
import { userProfile } from '../store/userProfile/MyProfile';
import LoadingPage from '../othercomps/loadingComp/loading';
import { friends } from '../store/Friends/friends';
import { BookOpen, Users, Edit3 } from 'lucide-react';
import { getUserThoughts } from '../store/thoughts/mythought';

export default function GenZProfileImproved() {
  const [activeTab, setActiveTab] = useState('about');
  const [showAllFriends, setShowAllFriends] = useState(false);
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
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent drop-shadow-2xl relative">
          Welcome To SocialNet
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
                <p className="text-gray-400 text-sm">@{MyProfile?.userId.username}</p>
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
                  <span className="text-xs text-gray-400 hidden sm:inline">Theme:</span>
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
                              ? new Date(wallbook.createdAt).toLocaleDateString()
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
    </div>
  );
}
