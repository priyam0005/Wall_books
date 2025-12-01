import React, { useState, useEffect } from 'react';
import {
  Home,
  MessageCircle,
  Compass,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Settings,
  Bookmark,
  PlusCircle,
  User,
  PowerIcon,
  BellIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from '../store/userProfile/MyProfile';
import Bellicon from '../othercomps/bellicon';

{
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const token = localStorage.getItem('auth');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //getting data from the redux store for profilePic and other data

  const mine = async () => {
    const resultAction = await dispatch(userProfile({ token }));
    if (userProfile.fulfilled.match(resultAction)) {
      console.log('the request is succesfull');
    } else if (userProfile.pending.match(resultAction)) {
      console.log('the request was aborted ');
    }
  };

  useEffect(() => {
    mine();
  }, [token, dispatch]);

  const profile = JSON.parse(localStorage.getItem('noob'));

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'notification', icon: BellIcon, label: 'Notification' },
    { id: 'create', icon: PlusCircle, label: 'Create' },
    { id: 'power', icon: PowerIcon, label: 'Log out' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const tabs = (tabId) => {
    setActiveTab(tabId);
  };

  // Your navigation functions - replace these with your actual logic
  const just = () => {
    navigate('/');
  };
  const message = () => console.log('Navigate messages');
  const profiler = () => {
    navigate('/profile');
  };

  const user = () => {
    navigate('/profile');
  };

  const explore = () => {
    navigate('/search');
  };

  const notify = () => {
    navigate('/notifications');
  };

  const SignIn = () => {
    navigate('/login');
  };

  const messages = async () => {
    navigate('/PersonalChat');
  };

  const { loading, error, list } = useSelector((state) => state.ReqList);
  console.log(list.length);

  const nors = async () => {
    const resultAction = await dispatch(Reqlist({ token }));
    if (Reqlist.fulfilled.match(resultAction)) {
      console.log('we should have our reqList data ');
    } else if (Reqlist.pending.match(resultAction)) {
    } else {
      console.log(error);
    }
  };

  console.log(list.length);

  useEffect(() => {
    nors();
  }, [token, dispatch]);

  return (
    <>
      {/* Sidebar - Always visible */}
      <aside
        className={`
          fixed left-0 top-16 h-screen bg-gradient-to-br from-black via-gray-900 to-black border-r border-gray-900 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Header with toggle */}
        <div className="px-6 py-8 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h4 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent">
                Welcome
              </h4>
            )}
            <button
              onClick={toggleSidebar}
              className={`p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0 text-gray-400 hover:text-white ${
                isCollapsed ? 'mx-auto' : ''
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 flex-1 py-4">
          <ul className="space-y-2 ">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'create') {
                        // Your create logic
                      } else if (item.id === 'profile') {
                        profiler();
                      } else if (item.id == 'notification') {
                        notify();
                      } else if (item.id === 'explore') {
                        explore();
                      } else if (item.id === 'power') {
                        SignIn();
                      } else if (item.id === 'messages') {
                        messages();
                      } else {
                        just();
                      }
                      tabs(item.id);
                    }}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center' : 'space-x-3'
                    } px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-gray-800/80'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {item.id === 'notification' ? (
                      <span className="relative">
                        <Icon className="w-6 h-6 text-gray-400" />
                        {list.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                            {list.length}
                          </span>
                        )}
                      </span>
                    ) : (
                      <Icon className="w-6 h-6 text-gray-400" />
                    )}
                    {!isCollapsed && (
                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-6 border-t border-gray-800/50 mt-auto">
          {!isCollapsed ? (
            <>
              {/* User Profile - Full */}
              <div className="group flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-800/50 mb-3">
                <div className="relative" onClick={user}>
                  <img
                    src={profile?.profilePic}
                    className="w-11 h-11  rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                  ></img>
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-black"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                    {profile?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors truncate">
                    @{profile?.userId?.username}
                  </p>
                </div>
              </div>

              {/* Settings */}
              <button className="group w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300">
                <Settings
                  size={18}
                  className="text-gray-500 group-hover:text-white transition-all duration-300"
                />
                <span className="text-sm font-medium tracking-wide">
                  Settings
                </span>
              </button>

              {/* Status indicator */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Online</span>
              </div>
            </>
          ) : (
            <>
              {/* User Profile - Collapsed */}
              <div className="group flex justify-center mb-3">
                <div className="relative cursor-pointer" onClick={user}>
                  <img
                    src={profile?.profilePic}
                    className="w-11 h-11  rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                  ></img>
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-black"></div>
                </div>
              </div>

              {/* Settings - Collapsed */}
              <button
                className="group w-full flex justify-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                title="Settings"
              >
                <Settings
                  size={18}
                  className="text-gray-500 group-hover:text-white transition-all duration-300"
                />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area with proper margin */}
    </>
  );
};

export default Sidebar;
