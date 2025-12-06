import React, { useEffect, useState } from 'react';
import { Search, User, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserCard from './searchCard';

const UserSearchResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // FIXED: Search function that works on both PC and mobile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't search if query is empty
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching for:', searchQuery);

      // FIXED: Use BACKEND URL (port 405), not frontend URL (port 5173)
      const response = await axios.get(
        `https://sc-net.onrender.com/auth/user/${searchQuery}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('✅ Search response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('❌ Search error:', error);
      setError(
        error.response?.data?.message || error.message || 'Search failed'
      );
      setResult({ data: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // FIXED: Enter key now triggers search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const userProfile = () => {
    navigate('/Profilia');
  };

  const NoResults = () => (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
        <Users className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">User not found</h3>
      <p className="text-gray-400 text-sm md:text-base">
        No users found matching your search query.
      </p>
      {error && <p className="text-red-400 mt-2 text-sm">Error: {error}</p>}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Searching for users...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 bg-clip-text text-transparent">
              WallBooks
            </h1>

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for people..."
                  className="w-full px-4 py-2.5 md:py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search Info */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Explore People</h2>
          <p className="text-gray-400 text-sm md:text-base mb-2">
            Search for people on SocialNet by their{' '}
            <span className="text-white font-medium">Display Name</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
            <span>Search for:</span>
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Users
            </span>
            <span className="text-gray-600">| Blog Entries</span>
            <span className="text-gray-600">| Forum Topics</span>
            <span className="text-gray-600 hidden sm:inline">| Groups</span>
            <span className="text-gray-600 hidden sm:inline">| Layouts</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b border-gray-800">
            <h3 className="font-semibold text-white text-sm md:text-base">
              {searchQuery ? (
                <>
                  Results for "<span className="text-blue-400">{searchQuery}</span>"
                  {result.data && result.data.length > 0 && (
                    <span className="ml-2 text-gray-400 text-sm">
                      ({result.data.length} {result.data.length === 1 ? 'user' : 'users'} found)
                    </span>
                  )}
                </>
              ) : (
                'Search Results'
              )}
            </h3>
          </div>

          {/* Results Content */}
          <div className="p-4 md:p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : result.data && result.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {result.data.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            ) : searchQuery ? (
              <NoResults />
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Enter a name or username to discover people
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Search Options */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm md:text-base">
            or try the{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
              » Advanced Search
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSearchResults;
