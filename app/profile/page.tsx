
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, postsAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchUserPosts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getProfile();
      setProfile(data);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const data = await usersAPI.getUserPosts();
      setPosts(data);
    } catch (err) {
      setPosts([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-4">Please log in to view your profile</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wisteria-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lemon-100 pb-20">
      {/* Profile Header */}
      <div className="bg-white rounded-b-3xl shadow p-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-wisteria-200 flex items-center justify-center mb-2 overflow-hidden">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`text-3xl text-wisteria-700 font-bold ${profile?.avatar_url ? 'hidden' : ''}`}>
            {profile?.full_name?.charAt(0) || user?.full_name?.charAt(0) || user?.username?.charAt(0) || '?'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-wisteria-700">{profile?.full_name || user?.full_name || user?.username}</h2>
        <div className="text-sm text-gray-600 mb-1">
          {profile?.year ? `${profile.year} Year` : ''}
          {profile?.university ? ` · ${profile.university}` : ''}
          {profile?.course ? ` · ${profile.course}` : ''}
        </div>
        {profile?.age && (
          <div className="text-sm text-gray-600 mb-1">
            Age: {profile.age} • {profile.gender}
          </div>
        )}
        {profile?.accommodation_status && (
          <div className="text-sm text-gray-600 mb-2">
            {profile.accommodation_status === 'looking_for_room' && 'Looking for a room'}
            {profile.accommodation_status === 'have_room' && 'Have a room, looking for roommate'}
            {profile.accommodation_status === 'want_to_swap' && 'Want to swap rooms'}
          </div>
        )}
        <button
          className="mt-2 px-6 py-2 bg-wisteria-500 text-white rounded-full text-sm font-medium hover:bg-wisteria-600 transition-colors"
          onClick={() => setShowEditModal(true)}
        >
          Edit Profile
        </button>
        
        <Link href="/profile-wizard" className="mt-2 px-6 py-2 bg-lemon-300 text-wisteria-700 rounded-full text-sm font-medium hover:bg-lemon-400 transition-colors">
          Complete Profile Wizard
        </Link>
        
        <Link href="/matches" className="mt-2 px-6 py-2 bg-wisteria-300 text-wisteria-700 rounded-full text-sm font-medium hover:bg-wisteria-400 transition-colors">
          View Matches
        </Link>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={async () => {
            await fetchProfile();
            setShowEditModal(false);
          }}
        />
      )}

      {/* User Posts */}
      <div className="px-4 pt-6">
        <h3 className="text-lg font-semibold text-wisteria-700 mb-4">My Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>You haven't created any posts yet.</p>
            <p className="text-sm mt-2">Create your first post to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-wisteria-200 flex items-center justify-center overflow-hidden">
                        {post.avatar_url ? (
                          <img 
                            src={post.avatar_url}
                            alt={post.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`text-sm font-bold text-wisteria-700 ${post.avatar_url ? 'hidden' : ''}`}>
                          {post.full_name?.charAt(0) || post.name?.charAt(0) || 'U'}
                        </span>
                      </div>
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
