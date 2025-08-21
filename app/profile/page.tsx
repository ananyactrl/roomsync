
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
        return 'bg-[#E1D2FF] text-[#5E4075]';
      case 'room':
        return 'bg-[#FEFDD0] text-[#5E4075]';
      case 'subletting':
        return 'bg-[#FFDCE8] text-[#5E4075]';
      default:
        return 'bg-gray-200 text-gray-700';
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
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#5E4075] mb-4">Please log in to view your profile</h1>
          <Link 
            href="/login" 
            className="bg-[#5E4075] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E4075]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-20">
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#5E4075]">My Profile</h1>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-[#5E4075] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full bg-[#E1D2FF] flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[#5E4075] font-bold">
                    {profile.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#5E4075] mb-2">{profile.full_name}</h2>
                <p className="text-gray-600 mb-1">@{profile.username}</p>
                <p className="text-gray-600 mb-3">{profile.email}</p>
                
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.university && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">University</p>
                      <p className="text-[#5E4075]">{profile.university}</p>
                    </div>
                  )}
                  {profile.major && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Major</p>
                      <p className="text-[#5E4075]">{profile.major}</p>
                    </div>
                  )}
                  {profile.year && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Graduation Year</p>
                      <p className="text-[#5E4075]">{profile.year}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-[#5E4075]">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Posts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#5E4075]">My Posts</h2>
            <Link 
              href="/create-post"
              className="bg-[#5E4075] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
            >
              Create New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="w-16 h-16 bg-[#E1D2FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-add-line text-[#5E4075] text-2xl"></i>
              </div>
              <h3 className="text-[#5E4075] font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start by creating your first post to find roommates or rooms!</p>
              <Link 
                href="/create-post"
                className="bg-[#5E4075] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-[#E1D2FF] to-[#FEFDD0] flex items-center justify-center">
                    <i className="ri-home-4-line text-[#5E4075] text-4xl"></i>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-green-600">₹{post.price.toLocaleString()}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[#5E4075] mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{post.location}</p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/rooms/${post.id}`}
                          className="bg-[#5E4075] text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-[#4A335F] transition-colors"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/rooms/${post.id}/edit`}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                    
                    {!post.is_active && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">This post is currently inactive</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#5E4075] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/messages"
              className="flex items-center p-4 bg-[#E1D2FF] rounded-xl hover:bg-[#D4C5F0] transition-colors"
            >
              <i className="ri-message-3-line text-[#5E4075] text-xl mr-3"></i>
              <div>
                <p className="font-medium text-[#5E4075]">Messages</p>
                <p className="text-sm text-gray-600">View your conversations</p>
              </div>
            </Link>
            <Link 
              href="/matches"
              className="flex items-center p-4 bg-[#FEFDD0] rounded-xl hover:bg-[#F5F2B8] transition-colors"
            >
              <i className="ri-heart-line text-[#5E4075] text-xl mr-3"></i>
              <div>
                <p className="font-medium text-[#5E4075]">Matches</p>
                <p className="text-sm text-gray-600">Find your perfect match</p>
              </div>
            </Link>
            <Link 
              href="/create-post"
              className="flex items-center p-4 bg-[#FFDCE8] rounded-xl hover:bg-[#F5C8D4] transition-colors"
            >
              <i className="ri-add-line text-[#5E4075] text-xl mr-3"></i>
              <div>
                <p className="font-medium text-[#5E4075]">Create Post</p>
                <p className="text-sm text-gray-600">List your space</p>
              </div>
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
