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
      subtitle: "Discover perfect rooms",
      color: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
      hoverColor: "hover:from-pink-500 hover:via-purple-600 hover:to-indigo-700",
      link: "/rooms"
    },
    { 
      icon: "ri-group-line", 
      title: "Find Roommate", 
      subtitle: "Connect with students",
      color: "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600",
      hoverColor: "hover:from-blue-500 hover:via-cyan-600 hover:to-teal-700",
      link: "/create-post"
    },
    { 
      icon: "ri-arrow-left-right-line", 
      title: "Room Swap", 
      subtitle: "Exchange accommodations",
      color: "bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600",
      hoverColor: "hover:from-purple-500 hover:via-pink-600 hover:to-rose-700",
      link: "/swap"
    },
    { 
      icon: "ri-chat-3-line", 
      title: "Messages", 
      subtitle: "Chat with matches",
      color: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
      hoverColor: "hover:from-green-500 hover:via-emerald-600 hover:to-teal-700",
      link: "/messages"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50">
      {/* Enhanced Header */}
      <header className="header-modern">
        <div className="container-modern">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-wisteria-500 to-wisteria-600 rounded-xl flex items-center justify-center shadow-glow animate-pulse-glow">
                <i className="ri-home-heart-fill text-white text-lg"></i>
              </div>
              <h1 className="text-2xl font-bold text-gradient font-display">RoomSync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-modern hover:shadow-glow transition-all duration-200 hover:scale-110">
                <i className="ri-search-line text-wisteria-600 text-lg"></i>
              </button>
              <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-modern hover:shadow-glow transition-all duration-200 hover:scale-110 relative">
                <i className="ri-notification-line text-wisteria-600 text-lg"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24">
        {/* Hero Section */}
        <div className="container-modern">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-wisteria-800 mb-4">
              Find Your Perfect <span className="text-gradient">Roommate</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with students, discover rooms, and create lasting friendships in your university community.
            </p>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link} className="group">
                <div className={`${action.color} ${action.hoverColor} rounded-2xl p-6 shadow-modern hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 mb-4 mx-auto bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <i className={`${action.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-white/80 text-xs">{action.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="text-center mb-8 space-y-4">
            <Link href="/profile-wizard" className="btn-primary inline-flex items-center space-x-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <i className="ri-user-settings-line"></i>
              <span>Complete Your Profile</span>
            </Link>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Link href="/matches" className="btn-secondary inline-flex items-center space-x-2">
                <i className="ri-heart-line"></i>
                <span>Find Your Matches</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Feed Section */}
        <div className="container-modern">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-wisteria-800">Recent Posts</h3>
            <Link href="/rooms" className="text-wisteria-600 hover:text-wisteria-700 font-medium text-sm flex items-center space-x-1">
              <span>View All</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="alert-error text-center">
              <i className="ri-error-warning-line text-xl mb-2"></i>
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="ri-home-heart-line text-wisteria-600 text-2xl"></i>
              </div>
              <h3 className="text-wisteria-800 font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to create a post and connect with others!</p>
              <Link href="/create-post" className="btn-primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div key={post.id} className="card card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Enhanced Post Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          {post.avatar_url ? (
                            <img 
                              src={post.avatar_url || '/default-avatar.png'}
                              alt={post.name || 'User'}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {(post.full_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-wisteria-800">{post.full_name || 'User'}</span>
                            {post.verified && (
                              <i className="ri-verified-badge-fill text-blue-500 text-sm"></i>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`badge-${post.type === 'roommate' ? 'primary' : post.type === 'room' ? 'secondary' : 'success'}`}>
                          {post.type === 'roommate' ? 'Roommate' : 
                           post.type === 'room' ? 'Room' : 'Swap'}
                        </span>
                        <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <i className="ri-more-line text-gray-600"></i>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Post Content */}
                    <div className="mb-4">
                      <h3 className="text-wisteria-800 font-semibold text-lg mb-3">{post.title || 'Untitled Post'}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.description || 'No description'}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <i className="ri-map-pin-line text-wisteria-500"></i>
                          <span>{post.location || 'Location not specified'}</span>
                        </div>
                        {post.price && (
                          <div className="flex items-center space-x-2">
                            <i className="ri-price-tag-3-line text-wisteria-500"></i>
                            <span className="font-semibold text-green-600">₹{post.price.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        {post.images.length === 1 ? (
                          <div className="relative overflow-hidden rounded-xl">
                            <img 
                              src={post.images[0].startsWith('http') ? post.images[0] : `http://localhost:5000${post.images[0]}`} 
                              alt="Room"
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {post.images.slice(0, 4).map((image: string, index: number) => (
                              <div key={index} className="relative overflow-hidden rounded-xl">
                                <img 
                                  src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                                  alt={`Room ${index + 1}`}
                                  className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {index === 3 && post.images.length > 4 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-semibold">+{post.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Enhanced Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 hover:text-wisteria-600 transition-colors">
                          <i className="ri-heart-line text-xl"></i>
                          <span className="text-sm font-medium">{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-wisteria-600 transition-colors">
                          <i className="ri-chat-1-line text-xl"></i>
                          <span className="text-sm font-medium">{post.comments || 0}</span>
                        </button>
                        <Link href="/messages" className="flex items-center space-x-2 hover:text-wisteria-600 transition-colors">
                          <i className="ri-send-plane-line text-xl"></i>
                        </Link>
                      </div>
                      <button className="hover:text-wisteria-600 transition-colors">
                        <i className={`${post.saved ? 'ri-bookmark-fill text-wisteria-600' : 'ri-bookmark-line'} text-xl`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="footer-modern">
        <div className="container-modern">
          <div className="grid grid-cols-5 h-16">
            <Link href="/" className="nav-item active">
              <i className="ri-home-5-fill text-xl"></i>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link href="/rooms" className="nav-item">
              <i className="ri-search-line text-xl"></i>
              <span className="text-xs font-medium">Discover</span>
            </Link>
            <Link href="/create-post" className="nav-item">
              <div className="w-10 h-10 bg-gradient-to-r from-wisteria-500 to-wisteria-600 rounded-full flex items-center justify-center shadow-glow mb-1">
                <i className="ri-add-line text-white text-lg"></i>
              </div>
              <span className="text-xs font-medium">Post</span>
            </Link>
            <Link href="/messages" className="nav-item">
              <i className="ri-chat-3-line text-xl"></i>
              <span className="text-xs font-medium">Messages</span>
            </Link>
            <Link href="/profile" className="nav-item">
              <i className="ri-user-line text-xl"></i>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
