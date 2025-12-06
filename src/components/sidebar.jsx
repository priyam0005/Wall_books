import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Home,
  MessageCircle,
  Compass,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Settings,
  User,
  PowerIcon,
  BellIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProfile } from '../store/userProfile/MyProfile';
import { Reqlist } from '../store/NotiFicationStore/ReqList';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  
  const token = localStorage.getItem('auth');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoized selectors
  const { list = [] } = useSelector((state) => state.ReqList || { list: [] });
  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('noob'));
    } catch {
      return null;
    }
  }, []);

  // Memoized menu items
  const menuItems = useMemo(() => [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'notification', icon: BellIcon, label: 'Notification' },
    { id: 'profile', icon: User, label: 'Profile' },
  ], []);

  // Fetch user profile and notifications only once
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(userProfile({ token })),
          dispatch(Reqlist({ token }))
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array - fetch only once

  // Screen size check with cleanup
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Memoized navigation handlers
  const handleNavigation = useCallback((itemId) => {
    setActiveTab(itemId);

    switch (itemId) {
      case 'profile':
        if (!token) {
          alert('Please sign in first to view your profile! 🔐');
          navigate('/login');
          return;
        }
        navigate('/profile');
        break;
      case 'notification':
        navigate('/notifications');
        break;
      case 'explore':
        navigate('/search');
        break;
      case 'power':
        navigate('/login');
        break;
      case 'messages':
        navigate('/PersonalChat');
        break;
      default:
        navigate('/');
    }
  }, [token, navigate]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Memoized notification badge
  const NotificationBadge = useCallback(({ count, isMobile = false }) => {
    if (count === 0) return null;
    
    if (isMobile) {
      return (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      );
    }
    
    return (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
        {count}
      </span>
    );
  }, []);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className={`
          fixed left-0 top-16 h-screen bg-gradient-to-br from-black via-gray-900 to-black border-r border-gray-900 z-50 transition-all duration-300 ease-in-out flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobile ? 'hidden' : 'flex'}
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
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className={`p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0 text-gray-400 hover:text-white ${
                  isCollapsed ? 'mx-auto' : ''
                }`}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 flex-1 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center' : 'space-x-3'
                    } px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-gray-800/80'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                    }`}
                    title={isCollapsed ? item.label : ''}
                    aria-label={item.label}
                  >
                    {item.id === 'notification' ? (
                      <span className="relative">
                        <Icon className="w-6 h-6" />
                        <NotificationBadge count={list.length} />
                      </span>
                    ) : (
                      <Icon className="w-6 h-6" />
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

            {/* Logout button */}
            <li>
              <button
                onClick={() => handleNavigation('power')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-gray-800/40`}
                title={isCollapsed ? 'Log out' : ''}
                aria-label="Log out"
              >
                <PowerIcon className="w-6 h-6" />
                {!isCollapsed && (
                  <span className="text-sm font-medium tracking-wide">
                    Log out
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Section - Settings Only */}
        <div className="px-4 py-6 border-t border-gray-800/50 mt-auto">
          {!isCollapsed ? (
            <>
              {/* Settings */}
              <button 
                className="group w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                aria-label="Settings"
              >
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
              {/* Settings - Collapsed */}
              <button
                className="group w-full flex justify-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                title="Settings"
                aria-label="Settings"
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-900 to-gray-900 border-t border-gray-800 z-50 md:hidden">
          <div className="flex justify-around items-center px-2 py-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'text-white bg-gray-800/60' : 'text-gray-400'
                  }`}
                  aria-label={item.label}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {item.id === 'notification' && (
                      <NotificationBadge count={list.length} isMobile={true} />
                    )}
                  </div>
                  <span className="text-[10px] mt-1 font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar