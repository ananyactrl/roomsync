'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

// Type definitions
interface User {
  userId: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
}

interface Post {
  id: string | number;
  user_id: string;
  title: string;
  description: string;
  type: 'room' | 'roommate' | 'subletting';
  location?: string;
  price?: number;
  room_type?: string;
  amenities?: string[];
  images?: string[];
  created_at: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
}

interface PostOwner {
  userId: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  university?: string;
}

interface Conversation {
  conversation_id: string | number;
  post_id: number;
  other_user_id: string;
  id?: string | number;
}

interface Message {
  sender_id: string;
  content: string;
}

type RequestStatus = 'pending' | 'accepted' | 'declined';
type ParamValue = string | string[] | undefined;

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [postOwner, setPostOwner] = useState<PostOwner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('pending');
  const [conversationId, setConversationId] = useState<string | number | null>(null);

  // Dummy data based on the ID
  const dummyPosts: { [key: string]: Post } = {
    '1': {
      id: 1,
      user_id: 'user1',
      title: "Looking for a roommate in Koramangala",
      description: "2BHK apartment near Forum Mall. Looking for a female roommate. Fully furnished with AC, washing machine, and refrigerator. Walking distance to restaurants and shopping. The apartment is in a safe neighborhood with 24/7 security. Perfect for students or working professionals. Utilities included in rent.",
      type: "roommate",
      location: "Koramangala, Bangalore",
      price: 8500,
      room_type: "Shared Room",
      amenities: ["AC", "Furnished", "Washing Machine", "WiFi", "Kitchen", "Security", "Parking"],
      images: [],
      created_at: "2024-01-15T10:30:00Z",
      username: "priya_sharma",
      full_name: "Priya Sharma",
      university: "Christ University"
    },
    '2': {
      id: 2,
      user_id: 'user2',
      title: "Single room available in Indiranagar",
      description: "Spacious room with attached bathroom. Near metro station. Perfect for working professionals. Includes basic furniture and utilities. The room is well-ventilated and gets plenty of natural light. Located in a quiet residential area but close to all amenities.",
      type: "room",
      location: "Indiranagar, Bangalore",
      price: 12000,
      room_type: "Single Room",
      amenities: ["Attached Bathroom", "Furnished", "WiFi", "Parking", "Security", "AC"],
      images: [],
      created_at: "2024-01-14T15:45:00Z",
      username: "rahul_verma",
      full_name: "Rahul Verma",
      university: "IISc Bangalore"
    },
    '3': {
      id: 3,
      user_id: 'user3',
      title: "Subletting my 1BHK in HSR Layout",
      description: "Fully furnished 1BHK available for 6 months. Near tech parks and restaurants. Perfect for professionals or students. The apartment comes with modern amenities and is located in a premium residential complex with gym and swimming pool access.",
      type: "subletting",
      location: "HSR Layout, Bangalore",
      price: 18000,
      room_type: "1BHK",
      amenities: ["Fully Furnished", "AC", "WiFi", "Gym", "Swimming Pool", "Security", "Parking"],
      images: [],
      created_at: "2024-01-13T09:20:00Z",
      username: "anjali_patel",
      full_name: "Anjali Patel",
      university: "Manipal University"
    },
    '4': {
      id: 4,
      user_id: 'user4',
      title: "Roommate needed in Whitefield",
      description: "3BHK apartment in a gated community. Looking for male roommate. Gym and pool access included. Near tech parks. The apartment is spacious with a beautiful view. Perfect for professionals working in the tech corridor.",
      type: "roommate",
      location: "Whitefield, Bangalore",
      price: 9500,
      room_type: "Shared Room",
      amenities: ["Gym", "Swimming Pool", "Security", "WiFi", "Furnished", "AC", "Parking"],
      images: [],
      created_at: "2024-01-12T14:15:00Z",
      username: "vikram_singh",
      full_name: "Vikram Singh",
      university: "PES University"
    },
    '5': {
      id: 5,
      user_id: 'user5',
      title: "Studio apartment in Electronic City",
      description: "Compact studio with kitchenette. Perfect for students or young professionals. Near IT companies and public transport. The studio is well-designed to maximize space and includes all essential amenities.",
      type: "room",
      location: "Electronic City, Bangalore",
      price: 11000,
      room_type: "Studio",
      amenities: ["Kitchenette", "WiFi", "Furnished", "Security", "Parking", "AC"],
      images: [],
      created_at: "2024-01-11T11:30:00Z",
      username: "meera_reddy",
      full_name: "Meera Reddy",
      university: "RVCE Bangalore"
    },
    '6': {
      id: 6,
      user_id: 'user6',
      title: "Subletting 2BHK in Marathahalli",
      description: "Spacious 2BHK with balcony. Available for 3 months. Near IT companies. Fully furnished with modern amenities. The apartment has a beautiful balcony with city views and is located in a family-friendly neighborhood.",
      type: "subletting",
      location: "Marathahalli, Bangalore",
      price: 22000,
      room_type: "2BHK",
      amenities: ["Balcony", "Fully Furnished", "AC", "WiFi", "Gym", "Security", "Parking"],
      images: [],
      created_at: "2024-01-10T16:45:00Z",
      username: "arjun_kumar",
      full_name: "Arjun Kumar",
      university: "BMS College"
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      
      // Ensure id is a string
      const postId = Array.isArray(id) ? id[0] : id;
      if (!postId) {
        throw new Error('Invalid post ID');
      }

      // Use dummy data instead of API call
      const postData = dummyPosts[postId];
      if (!postData) {
        throw new Error('Post not found');
      }
      
      setPost(postData);
      
      // Set dummy post owner data
      setPostOwner({
        userId: postData.user_id,
        username: postData.username || '',
        full_name: postData.full_name,
        avatar_url: postData.avatar_url,
        university: postData.university
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load post details');
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      const postId = Array.isArray(id) ? id[0] : id;
      router.push('/login?redirect=' + encodeURIComponent(`/rooms/${postId}`));
      return;
    }

    if (!post) return;

    try {
      // Simulate API call
      setRequestSent(true);
      setConversationId(123); // Dummy conversation ID
      alert('Request sent to post owner!');
    } catch (err) {
      setError('Failed to send request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E4075]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
          {error || 'Post not found'}
        </div>
        <div className="mt-4 text-center">
          <Link href="/rooms" className="text-[#5E4075] font-medium hover:underline">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && post.user_id === user.userId;

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-20">
      <div className="px-4 pt-6">
        <div className="flex items-center mb-6">
          <Link href="/rooms" className="mr-2">
            <i className="ri-arrow-left-line text-[#5E4075] text-lg"></i>
          </Link>
          <h1 className="text-xl font-bold text-[#5E4075]">Post Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#E1D2FF] flex items-center justify-center mr-2 overflow-hidden">
              {post.avatar_url ? (
                <img src={post.avatar_url} alt={post.username || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg text-[#5E4075] font-bold">
                  {post.full_name?.charAt(0) || post.username?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-[#5E4075] text-sm">{post.full_name || post.username}</p>
              <p className="text-xs text-gray-500">{post.university || 'University not specified'}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              post.type === 'roommate' ? 'bg-[#E1D2FF]' : 
              post.type === 'room' ? 'bg-[#FEFDD0]' : 
              'bg-[#FFDCE8]'} text-[#5E4075] mr-2`}>
              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </span>
            <span className="text-xs text-gray-500">{post.location || 'Location not specified'}</span>
          </div>

          <h2 className="text-lg font-semibold text-[#5E4075] mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.description}</p>

          {post.price && (
            <div className="mb-4">
              <p className="text-sm font-bold text-green-700">₹{post.price.toLocaleString()}</p>
            </div>
          )}

          {post.room_type && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Room Type: {post.room_type}</p>
            </div>
          )}

          {post.amenities && post.amenities.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {post.amenities.map((amenity: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-1 gap-2">
                {post.images.map((image: string, index: number) => (
                  <img 
                    key={index} 
                    src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                    alt={`${post.title} - Image ${index + 1}`} 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400 mb-4">
            Posted on {new Date(post.created_at).toLocaleString('en-IN')}
          </div>

          {!isOwner && (
            <div>
              {!requestSent ? (
                <button 
                  onClick={handleExpressInterest}
                  className="w-full bg-[#5E4075] text-white py-3 rounded-xl font-medium hover:bg-[#4A335F] transition-colors"
                >
                  Express Interest
                </button>
              ) : (
                <div className="space-y-2">
                  <div className={`w-full py-3 rounded-xl font-medium text-center ${
                    requestStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                    requestStatus === 'declined' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {requestStatus === 'accepted' ? 'Request Accepted' :
                     requestStatus === 'declined' ? 'Request Declined' :
                     'Request Pending'}
                  </div>
                  
                  {conversationId && (
                    <Link 
                      href={`/messages?conversation=${conversationId}`}
                      className="block w-full bg-[#5E4075] text-white py-3 rounded-xl font-medium text-center hover:bg-[#4A335F] transition-colors"
                    >
                      View Messages
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {isOwner && (
            <div className="flex gap-2">
              <Link 
                href={`/rooms/${Array.isArray(id) ? id[0] : id}/edit`}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-center hover:bg-gray-300 transition-colors"
              >
                Edit Post
              </Link>
              <Link 
                href={`/rooms/${Array.isArray(id) ? id[0] : id}/requests`}
                className="flex-1 bg-[#5E4075] text-white py-3 rounded-xl font-medium text-center hover:bg-[#4A335F] transition-colors"
              >
                View Requests
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}