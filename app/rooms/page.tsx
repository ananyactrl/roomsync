
'use client';

import { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import Link from 'next/link';

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Other'
];

const POST_TYPES = [
  { value: '', label: 'All' },
  { value: 'room', label: 'Room (Flat/PG/Hostel)' },
  { value: 'roommate', label: 'Roommate' },
  { value: 'swap', label: 'Room Swap' },
];

export default function RoomsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postsAPI.getAll({
        type: filters.type,
        search: filters.search,
        location: filters.location,
      });
      setPosts(
        data.filter((post: any) => {
          const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
          const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
          return (!filters.minPrice || (post.price || 0) >= min) && (!filters.maxPrice || (post.price || 0) <= max);
        })
      );
    } catch (err) {
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-lemon-100 pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-4">Find Rooms, Roommates & Swaps</h1>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
              placeholder="Search by title, description, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            >
              {POST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            >
              <option value="">All cities</option>
              {INDIAN_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
              placeholder="₹0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
              placeholder="₹∞"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading posts...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No posts found matching your criteria.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar_url || '/default-avatar.png'}
                        alt={post.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-wisteria-700 text-sm">{post.full_name || 'User'}</span>
                          {post.verified && (
                            <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.type === 'roommate' ? 'bg-wisteria-200 text-wisteria-700' :
                        post.type === 'room' ? 'bg-lemon-200 text-wisteria-700' :
                        'bg-wisteria-100 text-wisteria-700'
                      }`}>
                        {post.type === 'roommate' ? 'Roommate' : 
                         post.type === 'room' ? 'Room' : 'Swap'}
                      </span>
                      <button className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-more-line text-gray-400"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <h3 className="text-wisteria-700 font-semibold text-sm mb-2">{post.title || 'Untitled Post'}</h3>
                  <p className="text-wisteria-700 text-sm mb-3">{post.description || 'No description'}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <i className="ri-map-pin-line"></i>
                      <span>{post.location || 'Location not specified'}</span>
                    </div>
                    {post.price && (
                      <div className="flex items-center space-x-1">
                        <i className="ri-price-tag-3-line"></i>
                        <span className="font-medium">₹{post.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Images - Only show if images exist */}
                {post.images && post.images.length > 0 && (
                  <div className="px-4 pb-3">
                    {post.images.length === 1 ? (
                      <img 
                        src={post.images[0].startsWith('http') ? post.images[0] : `http://localhost:5000${post.images[0]}`} 
                        alt="Room"
                        className="w-full h-48 object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.slice(0, 4).map((image: string, index: number) => (
                          <img 
                            key={index}
                            src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                            alt={`Room ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ))}
                        {post.images.length > 4 && (
                          <div className="relative">
                            <img 
                              src={post.images[3].startsWith('http') ? post.images[3] : `http://localhost:5000${post.images[3]}`} 
                              alt="Room"
                              className="w-full h-24 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-medium">+{post.images.length - 4}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-1">
                        <i className="ri-heart-line text-gray-600 text-lg"></i>
                        <span className="text-sm text-gray-600">{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <i className="ri-chat-1-line text-gray-600 text-lg"></i>
                        <span className="text-sm text-gray-600">{post.comments || 0}</span>
                      </button>
                      <Link href="/messages" className="flex items-center space-x-1">
                        <i className="ri-send-plane-line text-gray-600 text-lg"></i>
                      </Link>
                    </div>
                    <button className="flex items-center space-x-1">
                      <i className={`${post.saved ? 'ri-bookmark-fill text-wisteria-600' : 'ri-bookmark-line text-gray-600'} text-lg`}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
