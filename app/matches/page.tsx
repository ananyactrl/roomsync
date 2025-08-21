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
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#5E4075] mb-4">Please log in to view your matches</h1>
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
          <h1 className="text-2xl font-bold text-[#5E4075]">Your Matches</h1>
          <div className="text-sm text-gray-600">
            {filteredMatches.length} matches found
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-[#5E4075] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setSelectedFilter('roommate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'roommate'
                  ? 'bg-[#5E4075] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Roommates
            </button>
            <button
              onClick={() => setSelectedFilter('room')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'room'
                  ? 'bg-[#5E4075] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setSelectedFilter('subletting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'subletting'
                  ? 'bg-[#5E4075] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Subletting
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="w-16 h-16 bg-[#E1D2FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-heart-line text-[#5E4075] text-2xl"></i>
            </div>
            <h3 className="text-[#5E4075] font-semibold mb-2">No matches yet</h3>
            <p className="text-gray-500 text-sm mb-4">Complete your profile and browse posts to find your perfect match!</p>
            <Link 
              href="/rooms"
              className="bg-[#5E4075] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
            >
              Browse Posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#E1D2FF] flex items-center justify-center mr-3 overflow-hidden">
                      {match.avatar_url ? (
                        <img src={match.avatar_url} alt={match.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg text-[#5E4075] font-bold">
                          {match.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#5E4075]">{match.full_name}</h3>
                      <p className="text-sm text-gray-600">@{match.username}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getCompatibilityColor(match.compatibility_score)}`}>
                      {match.compatibility_score}%
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">{match.bio}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">University</p>
                        <p className="font-medium text-[#5E4075]">{match.university}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Major</p>
                        <p className="font-medium text-[#5E4075]">{match.major}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Year</p>
                        <p className="font-medium text-[#5E4075]">{match.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Post Info */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(match.post_type)}`}>
                        {match.post_type.charAt(0).toUpperCase() + match.post_type.slice(1)}
                      </span>
                      <span className="text-sm font-bold text-green-600">₹{match.post_price.toLocaleString()}</span>
                    </div>
                    <h4 className="font-medium text-[#5E4075] text-sm mb-1">{match.post_title}</h4>
                    <p className="text-xs text-gray-600">{match.post_location}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link 
                      href={`/rooms/${match.post_id}`}
                      className="flex-1 bg-[#5E4075] text-white py-2 rounded-lg text-sm font-medium text-center hover:bg-[#4A335F] transition-colors"
                    >
                      View Post
                    </Link>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-[#5E4075] mb-4">Tips for Better Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#E1D2FF] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-user-settings-line text-[#5E4075] text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-[#5E4075] text-sm">Complete Your Profile</h4>
                <p className="text-xs text-gray-600">Add your university, major, and bio to get better matches.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#FEFDD0] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-search-line text-[#5E4075] text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-[#5E4075] text-sm">Browse More Posts</h4>
                <p className="text-xs text-gray-600">The more posts you view, the better our matching algorithm works.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#FFDCE8] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-message-3-line text-[#5E4075] text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-[#5E4075] text-sm">Start Conversations</h4>
                <p className="text-xs text-gray-600">Reach out to potential roommates to discuss compatibility.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#E1D2FF] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-heart-line text-[#5E4075] text-sm"></i>
              </div>
              <div>
                <h4 className="font-medium text-[#5E4075] text-sm">Be Patient</h4>
                <p className="text-xs text-gray-600">Finding the perfect roommate takes time. Don't rush your decision.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 