import React, { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserCard from './searchCard';

const UserSearchResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://sc-net.onrender.com/auth/user/${searchQuery}`,
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      setResult(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || 'Search failed'
      );
      setResult({ data: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => setSearchQuery(e.target.value);
  const handleKeyPress = (e) => e.key === 'Enter' && handleSubmit(e);

  const NoResults = () => (
    <div className="text-center py-16">
      <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-200">User not found</h3>
      <p className="text-gray-500 mt-2">No users match your search.</p>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="text-center py-16">
      <div className="h-10 w-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Searching…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex flex-col">
      {/* Top Sticky Bar */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 px-5 py-4 flex items-center gap-4">
        <h1 className="text-xl font-bold text-purple-400">Search</h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center flex-1 max-w-xl ml-auto relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search users..."
            className="w-full px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md 
              border border-white/10 text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
          />

          <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
        </form>
      </div>

      {/* Page Content */}
      <div className="px-5 py-6 max-w-6xl mx-auto w-full">
        {/* Results Glass Panel */}
        <div className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
          <div className="px-5 py-3 bg-purple-600/20 border-b border-white/10 rounded-t-xl">
            <h3 className="font-semibold text-purple-300">
              Results for “{searchQuery || '...'}”
            </h3>
          </div>

          <div className="p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : result.data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {result.data.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            ) : searchQuery ? (
              <NoResults />
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-200">
                  Start searching
                </h3>
                <p className="text-gray-500 mt-2">Enter a name to begin</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500">
          or try the{' '}
          <span className="text-purple-400 cursor-pointer hover:text-purple-300">
            Advanced Search »
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserSearchResults;
