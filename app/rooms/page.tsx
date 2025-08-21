
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: number;
  title: string;
  description: string;
  type: 'room' | 'roommate' | 'subletting';
  location: string;
  price: number;
  room_type?: string;
  amenities: string[];
  images: string[];
  created_at: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  university: string;
}

export default function RoomsPage() {
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(50000);

  const dummyPosts: Post[] = [
    {
      id: 1,
      title: "Looking for a roommate in Koramangala",
      description: "2BHK apartment near Forum Mall. Looking for a female roommate. Fully furnished with AC, washing machine, and refrigerator. Walking distance to restaurants and shopping.",
      type: "roommate",
      location: "Koramangala, Bangalore",
      price: 8500,
      room_type: "Shared Room",
      amenities: ["AC", "Furnished", "Washing Machine", "WiFi", "Kitchen"],
      images: [],
      created_at: "2024-01-15T10:30:00Z",
      username: "priya_sharma",
      full_name: "Priya Sharma",
      university: "Christ University"
    },
    {
      id: 2,
      title: "Single room available in Indiranagar",
      description: "Spacious room with attached bathroom. Near metro station. Perfect for working professionals. Includes basic furniture and utilities.",
      type: "room",
      location: "Indiranagar, Bangalore",
      price: 12000,
      room_type: "Single Room",
      amenities: ["Attached Bathroom", "Furnished", "WiFi", "Parking", "Security"],
      images: [],
      created_at: "2024-01-14T15:45:00Z",
      username: "rahul_verma",
      full_name: "Rahul Verma",
      university: "IISc Bangalore"
    },
    {
      id: 3,
      title: "Subletting my 1BHK in HSR Layout",
      description: "Fully furnished 1BHK available for 6 months. Near tech parks and restaurants. Perfect for professionals or students.",
      type: "subletting",
      location: "HSR Layout, Bangalore",
      price: 18000,
      room_type: "1BHK",
      amenities: ["Fully Furnished", "AC", "WiFi", "Gym", "Swimming Pool"],
      images: [],
      created_at: "2024-01-13T09:20:00Z",
      username: "anjali_patel",
      full_name: "Anjali Patel",
      university: "Manipal University"
    },
    {
      id: 4,
      title: "Roommate needed in Whitefield",
      description: "3BHK apartment in a gated community. Looking for male roommate. Gym and pool access included. Near tech parks.",
      type: "roommate",
      location: "Whitefield, Bangalore",
      price: 9500,
      room_type: "Shared Room",
      amenities: ["Gym", "Swimming Pool", "Security", "WiFi", "Furnished"],
      images: [],
      created_at: "2024-01-12T14:15:00Z",
      username: "vikram_singh",
      full_name: "Vikram Singh",
      university: "PES University"
    },
    {
      id: 5,
      title: "Studio apartment in Electronic City",
      description: "Compact studio with kitchenette. Perfect for students or young professionals. Near IT companies and public transport.",
      type: "room",
      location: "Electronic City, Bangalore",
      price: 11000,
      room_type: "Studio",
      amenities: ["Kitchenette", "WiFi", "Furnished", "Security", "Parking"],
      images: [],
      created_at: "2024-01-11T11:30:00Z",
      username: "meera_reddy",
      full_name: "Meera Reddy",
      university: "RVCE Bangalore"
    },
    {
      id: 6,
      title: "Subletting 2BHK in Marathahalli",
      description: "Spacious 2BHK with balcony. Available for 3 months. Near IT companies. Fully furnished with modern amenities.",
      type: "subletting",
      location: "Marathahalli, Bangalore",
      price: 22000,
      room_type: "2BHK",
      amenities: ["Balcony", "Fully Furnished", "AC", "WiFi", "Gym"],
      images: [],
      created_at: "2024-01-10T16:45:00Z",
      username: "arjun_kumar",
      full_name: "Arjun Kumar",
      university: "BMS College"
    },
    {
      id: 7,
      title: "Roommate wanted in JP Nagar",
      description: "2BHK apartment looking for female roommate. Near metro and shopping centers. Peaceful neighborhood.",
      type: "roommate",
      location: "JP Nagar, Bangalore",
      price: 7800,
      room_type: "Shared Room",
      amenities: ["WiFi", "Furnished", "Kitchen", "Security", "Parking"],
      images: [],
      created_at: "2024-01-09T13:20:00Z",
      username: "kavya_iyer",
      full_name: "Kavya Iyer",
      university: "St. Joseph's College"
    },
    {
      id: 8,
      title: "Single room in Banashankari",
      description: "Cozy single room with attached bathroom. Near bus stand and market. Ideal for students.",
      type: "room",
      location: "Banashankari, Bangalore",
      price: 9000,
      room_type: "Single Room",
      amenities: ["Attached Bathroom", "WiFi", "Furnished", "Kitchen Access"],
      images: [],
      created_at: "2024-01-08T10:15:00Z",
      username: "aditya_malhotra",
      full_name: "Aditya Malhotra",
      university: "Bangalore University"
    },
    {
      id: 9,
      title: "Subletting 1BHK in Bellandur",
      description: "Modern 1BHK apartment available for 4 months. Near tech parks and restaurants. Fully furnished.",
      type: "subletting",
      location: "Bellandur, Bangalore",
      price: 16000,
      room_type: "1BHK",
      amenities: ["Modern Furnishing", "AC", "WiFi", "Gym", "Security"],
      images: [],
      created_at: "2024-01-07T14:30:00Z",
      username: "neha_gupta",
      full_name: "Neha Gupta",
      university: "NMIT Bangalore"
    },
    {
      id: 10,
      title: "Roommate needed in Sarjapur",
      description: "3BHK villa looking for male roommate. Large garden and parking space. Near international schools.",
      type: "roommate",
      location: "Sarjapur, Bangalore",
      price: 11000,
      room_type: "Shared Room",
      amenities: ["Garden", "Parking", "WiFi", "Furnished", "Security"],
      images: [],
      created_at: "2024-01-06T09:45:00Z",
      username: "rajesh_khanna",
      full_name: "Rajesh Khanna",
      university: "MS Ramaiah University"
    },
    {
      id: 11,
      title: "Studio in Domlur",
      description: "Compact studio apartment perfect for working professionals. Near tech parks and shopping centers.",
      type: "room",
      location: "Domlur, Bangalore",
      price: 13500,
      room_type: "Studio",
      amenities: ["Compact Kitchen", "WiFi", "Furnished", "Security", "Parking"],
      images: [],
      created_at: "2024-01-05T16:20:00Z",
      username: "sunita_rao",
      full_name: "Sunita Rao",
      university: "Dayananda Sagar University"
    },
    {
      id: 12,
      title: "Subletting 2BHK in Yelahanka",
      description: "Spacious 2BHK with terrace. Available for 5 months. Near airport and universities.",
      type: "subletting",
      location: "Yelahanka, Bangalore",
      price: 19000,
      room_type: "2BHK",
      amenities: ["Terrace", "Fully Furnished", "AC", "WiFi", "Parking"],
      images: [],
      created_at: "2024-01-04T11:10:00Z",
      username: "manish_jain",
      full_name: "Manish Jain",
      university: "Acharya Institute"
    }
  ];

  const filteredPosts = dummyPosts.filter(post => {
    const matchesType = selectedType === 'all' || post.type === selectedType;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = post.price <= priceRange;
    return matchesType && matchesSearch && matchesPrice;
  });

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
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-20">
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#5E4075]">Find Your Perfect Home</h1>
          {isAuthenticated && (
            <Link 
              href="/create-post"
              className="bg-[#5E4075] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Create Post
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E4075]"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E4075]"
              >
                <option value="all">All Types</option>
                <option value="roommate">Roommate</option>
                <option value="room">Room</option>
                <option value="subletting">Subletting</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price: ₹{priceRange.toLocaleString()}
              </label>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                {filteredPosts.length} posts found
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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
                
                {post.room_type && (
                  <p className="text-sm text-gray-600 mb-3">Room Type: {post.room_type}</p>
                )}
                
                {post.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {post.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                      {post.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          +{post.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#E1D2FF] rounded-full flex items-center justify-center mr-2">
                      <span className="text-sm font-bold text-[#5E4075]">
                        {post.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#5E4075]">{post.full_name}</p>
                      <p className="text-xs text-gray-500">{post.university}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                    <Link 
                      href={`/rooms/${post.id}`}
                      className="bg-[#5E4075] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4A335F] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#E1D2FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-[#5E4075] text-2xl"></i>
            </div>
            <h3 className="text-[#5E4075] font-semibold mb-2">No posts found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
