'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

interface Match {
  id: number;
  user_id: number;
  full_name: string;
  username: string;
  avatar_url?: string;
  university: string;
  major: string;
  year: string;
  bio: string;
  compatibility_score: number;
  post_id: number;
  post_title: string;
  post_type: string;
  post_price: number;
  post_location: string;
}

export default function MatchesPage() {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Dummy matches data
  const dummyMatches: Match[] = [
    {
      id: 1,
      user_id: 2,
      full_name: "Priya Sharma",
      username: "priya_sharma",
      university: "Christ University",
      major: "Computer Science",
      year: "3rd Year",
      bio: "Software engineering student who loves reading and traveling. Looking for a clean, quiet place to stay.",
      compatibility_score: 95,
      post_id: 1,
      post_title: "Looking for a roommate in Koramangala",
      post_type: "roommate",
      post_price: 8500,
      post_location: "Koramangala, Bangalore"
    },
    {
      id: 2,
      user_id: 3,
      full_name: "Kavya Iyer",
      username: "kavya_iyer",
      university: "St. Joseph's College",
      major: "Business Administration",
      year: "2nd Year",
      bio: "Business student who enjoys cooking and watching movies. Prefer a friendly roommate.",
      compatibility_score: 88,
      post_id: 1,
      post_title: "Looking for a roommate in Koramangala",
      post_type: "roommate",
      post_price: 8500,
      post_location: "Koramangala, Bangalore"
    },
    {
      id: 3,
      user_id: 4,
      full_name: "Aditya Malhotra",
      username: "aditya_malhotra",
      university: "Bangalore University",
      major: "Mechanical Engineering",
      year: "4th Year",
      bio: "Final year engineering student. Love playing guitar and need a peaceful environment to study.",
      compatibility_score: 82,
      post_id: 2,
      post_title: "Single room available in Indiranagar",
      post_type: "room",
      post_price: 12000,
      post_location: "Indiranagar, Bangalore"
    },
    {
      id: 4,
      user_id: 5,
      full_name: "Neha Gupta",
      username: "neha_gupta",
      university: "NMIT Bangalore",
      major: "Information Technology",
      year: "3rd Year",
      bio: "IT student who loves coding and gaming. Looking for a tech-savvy roommate.",
      compatibility_score: 78,
      post_id: 3,
      post_title: "Subletting my 1BHK in HSR Layout",
      post_type: "subletting",
      post_price: 18000,
      post_location: "HSR Layout, Bangalore"
    },
    {
      id: 5,
      user_id: 6,
      full_name: "Rajesh Khanna",
      username: "rajesh_khanna",
      university: "MS Ramaiah University",
      major: "Electronics Engineering",
      year: "2nd Year",
      bio: "Electronics student who enjoys building circuits and watching sci-fi movies.",
      compatibility_score: 75,
      post_id: 4,
      post_title: "Roommate needed in Whitefield",
      post_type: "roommate",
      post_price: 9500,
      post_location: "Whitefield, Bangalore"
    },
    {
      id: 6,
      user_id: 7,
      full_name: "Sunita Rao",
      username: "sunita_rao",
      university: "Dayananda Sagar University",
      major: "Civil Engineering",
      year: "4th Year",
      bio: "Civil engineering student who loves architecture and design. Need a creative roommate.",
      compatibility_score: 72,
      post_id: 5,
      post_title: "Studio apartment in Electronic City",
      post_type: "room",
      post_price: 11000,
      post_location: "Electronic City, Bangalore"
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // Use dummy data instead of API call
      setMatches(dummyMatches);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'all') return true;
    return match.post_type === selectedFilter;
  });

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
    if (score >= 80) return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
    return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <i className="ri-heart-line text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-wisteria-800 mb-4">Please log in to view your matches</h1>
          <p className="text-gray-600 mb-8">Sign in to discover your perfect roommate matches</p>
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
          <p className="text-gray-600">Finding your perfect matches...</p>
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
            <h1 className="text-3xl font-bold text-wisteria-800 mb-2">Your Matches</h1>
            <p className="text-gray-600">Discover your perfect roommate connections</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-wisteria-600">{filteredMatches.length}</div>
            <div className="text-sm text-gray-500">matches found</div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-wisteria-800 mb-4">Filter by Type</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-wisteria-500 to-wisteria-600 text-white shadow-glow'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-wisteria-300 hover:bg-wisteria-50'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setSelectedFilter('roommate')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedFilter === 'roommate'
                  ? 'bg-gradient-to-r from-wisteria-500 to-wisteria-600 text-white shadow-glow'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-wisteria-300 hover:bg-wisteria-50'
              }`}
            >
              Roommates
            </button>
            <button
              onClick={() => setSelectedFilter('room')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedFilter === 'room'
                  ? 'bg-gradient-to-r from-wisteria-500 to-wisteria-600 text-white shadow-glow'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-wisteria-300 hover:bg-wisteria-50'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setSelectedFilter('subletting')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedFilter === 'subletting'
                  ? 'bg-gradient-to-r from-wisteria-500 to-wisteria-600 text-white shadow-glow'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-wisteria-300 hover:bg-wisteria-50'
              }`}
            >
              Subletting
            </button>
          </div>
        </div>

        {/* Enhanced Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="empty-state-icon">
              <i className="ri-heart-line text-wisteria-600 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-wisteria-800 mb-4">No matches yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Complete your profile and browse posts to find your perfect match! Our algorithm will suggest the best roommates based on your preferences.</p>
            <div className="space-y-4">
              <Link href="/rooms" className="btn-primary">
                Browse Posts
              </Link>
              <div>
                <Link href="/profile-wizard" className="btn-secondary">
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredMatches.map((match, index) => (
              <div key={match.id} className="card card-hover animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="p-6">
                  {/* Enhanced User Info */}
                  <div className="flex items-center mb-6">
                    <div className="avatar-large mr-4">
                      {match.avatar_url ? (
                        <img src={match.avatar_url} alt={match.full_name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {match.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-wisteria-800 mb-1">{match.full_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">@{match.username}</p>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getCompatibilityColor(match.compatibility_score)}`}>
                        {match.compatibility_score}% Match
                      </div>
                    </div>
                  </div>

                  {/* Enhanced User Details */}
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">{match.bio}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">University</p>
                        <p className="font-semibold text-wisteria-800 text-sm">{match.university}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Major</p>
                        <p className="font-semibold text-wisteria-800 text-sm">{match.major}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Year</p>
                        <p className="font-semibold text-wisteria-800 text-sm">{match.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Post Info */}
                  <div className="border-t border-gray-100 pt-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(match.post_type)}`}>
                        {match.post_type.charAt(0).toUpperCase() + match.post_type.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-green-600">₹{match.post_price.toLocaleString()}</span>
                    </div>
                    <h4 className="font-semibold text-wisteria-800 text-lg mb-2">{match.post_title}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-map-pin-line text-wisteria-500 mr-2"></i>
                      <span>{match.post_location}</span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex gap-3">
                    <Link 
                      href={`/rooms/${match.post_id}`}
                      className="flex-1 btn-primary text-center"
                    >
                      View Post
                    </Link>
                    <button className="flex-1 btn-secondary">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Tips Section */}
        <div className="card p-8 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold text-wisteria-800 mb-6 text-center">Tips for Better Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-wisteria-50 to-wisteria-100 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-modern">
                <i className="ri-user-settings-line text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-wisteria-800 mb-2">Complete Your Profile</h4>
                <p className="text-sm text-gray-600">Add your university, major, and bio to get better matches.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-lemon-50 to-lemon-100 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-lemon-400 to-lemon-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-modern">
                <i className="ri-search-line text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-wisteria-800 mb-2">Browse More Posts</h4>
                <p className="text-sm text-gray-600">The more posts you view, the better our matching algorithm works.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-modern">
                <i className="ri-message-3-line text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-wisteria-800 mb-2">Start Conversations</h4>
                <p className="text-sm text-gray-600">Reach out to potential roommates to discuss compatibility.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-modern">
                <i className="ri-heart-line text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold text-wisteria-800 mb-2">Be Patient</h4>
                <p className="text-sm text-gray-600">Finding the perfect roommate takes time. Don't rush your decision.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 