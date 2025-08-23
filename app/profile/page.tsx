
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import EditProfileModal from './EditProfileModal';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  university?: string;
  major?: string;
  year?: string;
  created_at: string;
}

interface UserPost {
  id: number;
  title: string;
  description: string;
  type: string;
  price: number;
  location: string;
  room_type: string;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Dummy profile data
  const dummyProfile: UserProfile = {
    id: '1',
    username: 'rahul_verma',
    email: 'rahul.verma@email.com',
    full_name: 'Rahul Verma',
    avatar_url: '',
    bio: 'Software engineer working in Bangalore. Love reading and traveling. Looking for a clean, quiet place to stay.',
    university: 'IISc Bangalore',
    major: 'Computer Science',
    year: '2022',
    created_at: '2023-06-15T10:30:00Z'
  };

  // Dummy posts data
  const dummyPosts: UserPost[] = [
    {
      id: 1,
      title: "Looking for a roommate in Koramangala",
      description: "2BHK apartment near Forum Mall. Looking for a female roommate. Fully furnished with AC, washing machine, and refrigerator.",
      type: "roommate",
      price: 8500,
      location: "Koramangala, Bangalore",
      room_type: "Shared Room",
      amenities: ["AC", "Furnished", "Washing Machine", "WiFi", "Kitchen"],
      images: [],
      is_active: true,
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Single room available in Indiranagar",
      description: "Spacious room with attached bathroom. Near metro station. Perfect for working professionals.",
      type: "room",
      price: 12000,
      location: "Indiranagar, Bangalore",
      room_type: "Single Room",
      amenities: ["Attached Bathroom", "Furnished", "WiFi", "Parking", "Security"],
      images: [],
      is_active: true,
      created_at: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      title: "Subletting my 1BHK in HSR Layout",
      description: "Fully furnished 1BHK available for 6 months. Near tech parks and restaurants. Perfect for professionals or students.",
      type: "subletting",
      price: 18000,
      location: "HSR Layout, Bangalore",
      room_type: "1BHK",
      amenities: ["Fully Furnished", "AC", "WiFi", "Gym", "Swimming Pool"],
      images: [],
      is_active: false,
      created_at: "2024-01-13T09:20:00Z"
    }
  ];

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
      // Use dummy data instead of API call
      setProfile(dummyProfile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      // Use dummy data instead of API call
      setPosts(dummyPosts);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'roommate':
        return 'bg-gradient-to-r from-wisteria-500 to-wisteria-600 text-white';
      case 'room':
        return 'bg-gradient-to-r from-lemon-500 to-lemon-600 text-white';
      case 'subletting':
        return 'bg-gradient-to-r from-pink-500 to-rose-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <i className="ri-user-line text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-wisteria-800 mb-4">Please log in to view your profile</h1>
          <p className="text-gray-600 mb-8">Sign in to access your personal dashboard</p>
          <Link href="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50 pb-24">
      <div className="container-modern pt-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-wisteria-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and posts</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-primary"
          >
            <i className="ri-edit-line mr-2"></i>
            Edit Profile
          </button>
        </div>

        {/* Enhanced Profile Card */}
        {profile && (
          <div className="card p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start space-x-6">
              <div className="avatar-large">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-bold text-wisteria-800">{profile.full_name}</h2>
                  <span className="badge-success">Verified</span>
                </div>
                <p className="text-gray-600 mb-2 flex items-center">
                  <i className="ri-at-line mr-2"></i>
                  @{profile.username}
                </p>
                <p className="text-gray-600 mb-4 flex items-center">
                  <i className="ri-mail-line mr-2"></i>
                  {profile.email}
                </p>
                
                {profile.bio && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.university && (
                    <div className="bg-gradient-to-r from-wisteria-50 to-wisteria-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">University</p>
                      <p className="font-semibold text-wisteria-800">{profile.university}</p>
                    </div>
                  )}
                  {profile.major && (
                    <div className="bg-gradient-to-r from-lemon-50 to-lemon-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Major</p>
                      <p className="font-semibold text-wisteria-800">{profile.major}</p>
                    </div>
                  )}
                  {profile.year && (
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Graduation Year</p>
                      <p className="font-semibold text-wisteria-800">{profile.year}</p>
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Member Since</p>
                    <p className="font-semibold text-wisteria-800">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced My Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h2 className="text-2xl font-bold text-wisteria-800 mb-2">My Posts</h2>
              <p className="text-gray-600">Manage your accommodation listings</p>
            </div>
            <Link href="/create-post" className="btn-primary">
              <i className="ri-add-line mr-2"></i>
              Create New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="empty-state-icon">
                <i className="ri-add-line text-wisteria-600 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-wisteria-800 mb-4">No posts yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Start by creating your first post to find roommates or rooms! Share your space and connect with others.</p>
              <Link href="/create-post" className="btn-primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid-cards">
              {posts.map((post, index) => (
                <div key={post.id} className="card card-hover animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  {/* Enhanced Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-wisteria-100 via-lemon-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-wisteria-200/20 to-lemon-200/20"></div>
                    <i className="ri-home-4-line text-wisteria-600 text-5xl relative z-10"></i>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(post.type)}`}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </span>
                    </div>
                    {!post.is_active && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">₹{post.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-wisteria-800 mb-3 line-clamp-1">{post.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <i className="ri-map-pin-line text-wisteria-500 mr-2"></i>
                      <span className="text-sm">{post.location}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">{post.description}</p>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Room Type</p>
                      <p className="font-semibold text-wisteria-800">{post.room_type}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Link 
                          href={`/rooms/${post.id}`}
                          className="btn-primary text-sm"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/rooms/${post.id}/edit`}
                          className="btn-secondary text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Quick Actions */}
        <div className="card p-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-2xl font-bold text-wisteria-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/messages"
              className="group p-6 bg-gradient-to-r from-wisteria-50 to-wisteria-100 rounded-2xl hover:from-wisteria-100 hover:to-wisteria-200 transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <i className="ri-message-3-line text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-wisteria-800 mb-2">Messages</h4>
              <p className="text-sm text-gray-600">View your conversations</p>
            </Link>
            <Link 
              href="/matches"
              className="group p-6 bg-gradient-to-r from-lemon-50 to-lemon-100 rounded-2xl hover:from-lemon-100 hover:to-lemon-200 transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-lemon-400 to-lemon-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <i className="ri-heart-line text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-wisteria-800 mb-2">Matches</h4>
              <p className="text-sm text-gray-600">Find your perfect match</p>
            </Link>
            <Link 
              href="/create-post"
              className="group p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl hover:from-pink-100 hover:to-pink-200 transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <i className="ri-add-line text-white text-xl"></i>
              </div>
              <h4 className="font-semibold text-wisteria-800 mb-2">Create Post</h4>
              <p className="text-sm text-gray-600">List your space</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            // Refresh profile data
            fetchProfile();
          }}
        />
      )}
    </div>
  );
}
