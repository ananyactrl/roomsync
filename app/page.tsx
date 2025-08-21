'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { postsAPI } from './services/api';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postsAPI.getAll();
      // Sort by created_at DESC (newest first)
      setPosts(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err: any) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      icon: "ri-home-heart-line", 
      title: "Find Room", 
      color: "bg-gradient-to-br from-pink-200 to-pink-300",
      link: "/rooms"
    },
    { 
      icon: "ri-group-line", 
      title: "Find Roommate", 
      color: "bg-gradient-to-br from-blue-200 to-blue-300",
      link: "/create-post"
    },
    { 
      icon: "ri-arrow-left-right-line", 
      title: "Room Swap", 
      color: "bg-gradient-to-br from-purple-200 to-purple-300",
      link: "/swap"
    },
    { 
      icon: "ri-chat-3-line", 
      title: "Messages", 
      color: "bg-gradient-to-br from-green-200 to-green-300",
      link: "/messages"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-lemon-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-wisteria-400 to-wisteria-500 rounded-full flex items-center justify-center">
              <i className="ri-home-heart-fill text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-wisteria-700" style={{fontFamily: 'var(--font-pacifico)'}}>RoomSync</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-search-line text-wisteria-600 text-lg"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-notification-line text-wisteria-600 text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20">
        {/* Quick Actions */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link} className="block">
                <div className={`${action.color} rounded-lg aspect-square flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="w-8 h-8 mb-2 flex items-center justify-center">
                    <i className={`${action.icon} text-wisteria-700 text-lg`}></i>
                  </div>
                  <p className="text-xs font-medium text-wisteria-700">{action.title}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Profile Wizard Link */}
          <div className="mt-6 text-center">
            <Link href="/profile-wizard" className="inline-flex items-center space-x-2 px-6 py-3 bg-wisteria-500 text-white rounded-xl font-medium hover:bg-wisteria-600 transition-colors">
              <i className="ri-user-settings-line"></i>
              <span>Complete Your Profile</span>
            </Link>
            
            <div className="mt-3">
              <Link href="/matches" className="inline-flex items-center space-x-2 px-6 py-3 bg-lemon-300 text-wisteria-700 rounded-xl font-medium hover:bg-lemon-400 transition-colors">
                <i className="ri-heart-line"></i>
                <span>Find Your Matches</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="px-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading posts...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No posts yet. Be the first to create a post!</div>
          ) : (
            posts.map((post) => (
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
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          <Link href="/" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-home-5-fill text-wisteria-600 text-lg"></i>
            <span className="text-xs text-wisteria-600 font-medium">Home</span>
          </Link>
          <Link href="/rooms" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-search-line text-gray-400 text-lg"></i>
            <span className="text-xs text-gray-400">Discover</span>
          </Link>
          <Link href="/create-post" className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-wisteria-500 rounded-full flex items-center justify-center mb-1">
              <i className="ri-add-line text-white text-lg"></i>
            </div>
            <span className="text-xs text-gray-400">Post</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-chat-3-line text-gray-400 text-lg"></i>
            <span className="text-xs text-gray-400">Messages</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-user-line text-gray-400 text-lg"></i>
            <span className="text-xs text-gray-400">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
