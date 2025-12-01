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
        `https://r01ck4rh-405.inc1.devtunnels.ms/auth/user/${searchQuery}`,
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
    <div className="text-center py-16">
      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">User not found</h3>
      <p className="text-gray-400">
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-blue-400">SocialNet</h1>

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 max-w-lg flex items-center space-x-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for people..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full font-medium transition-colors duration-200"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Search</h2>
          <p className="text-gray-400">
            Search for People on SocialNet by their{' '}
            <span className="text-white font-medium">Name:</span>
          </p>
          <p className="text-gray-400 mt-2">
            Search for: <span className="text-green-400">✓ Users</span> | Blog
            Entries | Forum Topics | Groups | Layouts
          </p>
        </div>

        {/* Results Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          {/* Results Header */}
          <div className="bg-yellow-500 text-black px-4 py-3 rounded-t-lg font-semibold">
            Results for "{searchQuery || '...'}"
          </div>

          {/* Results Content */}
          <div className="p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : result.data && result.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {result.data.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            ) : searchQuery ? (
              <NoResults />
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start Searching
                </h3>
                <p className="text-gray-400">
                  Enter a name to search for users
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Search Options */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            or try the{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
              » Advanced Search
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSearchResults;
