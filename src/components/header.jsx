import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostUser } from '../store/profile';
import {
  Search,
  Home,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function ClassicSocialHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const [messages] = useState(5);

  const navigate = useNavigate();

  const handleclick = () => {
    navigate('/profile');
  };
  const home = () => {
    navigate('/');
  };

  const notification = () => {
    navigate('/notifications');
  };

  const search = () => {
    navigate('/search');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const message = () => {
    navigate('/messages');
  };

  const token = localStorage.getItem('auth');

  const { profile } = useSelector((state) => state.flex);
  console.log(profile);
  const [query, setQuery] = useState('');
  const { user } = useSelector((state) => state.just);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [flex, setFlex] = useState('');

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get('http://localhost:405/auth/userProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data.data);
        setFlex(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [setFlex]);

  return (
    <header className="bg-gradient-to-br from-black via-gray-900 to-black border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-blue-500 font-bold text-xl tracking-tight">
              SocialNet
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-10">
            {/* Search bar removed - space preserved */}
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={home}
            >
              <Home className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Home</span>
            </button>

            <button className="flex items-center text-gray-300 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Friends</span>
            </button>

            <button
              onClick={message}
              className="flex items-center text-gray-300 hover:text-white transition-colors relative"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Messages</span>
              {messages > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {messages}
                </span>
              )}
            </button>

            <button
              onClick={notification}
              className="flex items-center text-gray-300 hover:text-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Notifications</span>
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </nav>

          <div className="hidden md:flex items-center ml-8">
            <div className="relative group">
              <button
                onClick={handleclick}
                className="flex items-center text-white hover:text-blue-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-2 ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all">
                  {flex?.profilePic ? (
                    <img
                      src={flex?.profilePic}
                      className="w-full h-full object-cover object-center"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </a>

                  <a className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <hr className="my-1 border-gray-700" />

                  <a className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>

          <button
            className="md:hidden text-white hover:text-blue-400"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="space-y-1">
              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Home className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Home</span>
              </button>

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Users className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Friends</span>
              </button>

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Messages</span>
                {messages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {messages}
                  </span>
                )}
              </button>

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Notifications</span>
                {notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <hr className="my-2 border-gray-700" />

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <User className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Profile</span>
              </button>

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <button className="flex items-center w-full px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
