'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

type Conversation = {
  conversation_id: number;
  post_id: number;
  post_title: string;
  post_type: string;
  other_user_id: number;
  other_username: string;
  other_full_name: string;
  other_avatar_url: string;
  conversation_created_at: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
};

type Post = {
  id: number;
  user_id: number;
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
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export default function PostRequestsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy post data
  const dummyPosts: { [key: string]: Post } = {
    '1': {
      id: 1,
      user_id: 1,
      title: "Looking for a roommate in Koramangala",
      description: "2BHK apartment near Forum Mall. Looking for a female roommate. Fully furnished with AC, washing machine, and refrigerator.",
      type: "roommate",
      price: 8500,
      location: "Koramangala, Bangalore",
      room_type: "Shared Room",
      amenities: ["AC", "Furnished", "Washing Machine", "WiFi", "Kitchen"],
      images: [],
      is_active: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      username: "current_user",
      full_name: "You",
      avatar_url: ""
    },
    '2': {
      id: 2,
      user_id: 1,
      title: "Single room available in Indiranagar",
      description: "Spacious room with attached bathroom. Near metro station. Perfect for working professionals.",
      type: "room",
      price: 12000,
      location: "Indiranagar, Bangalore",
      room_type: "Single Room",
      amenities: ["Attached Bathroom", "Furnished", "WiFi", "Parking", "Security"],
      images: [],
      is_active: true,
      created_at: "2024-01-14T15:45:00Z",
      updated_at: "2024-01-14T15:45:00Z",
      username: "current_user",
      full_name: "You",
      avatar_url: ""
    },
    '3': {
      id: 3,
      user_id: 1,
      title: "Subletting my 1BHK in HSR Layout",
      description: "Fully furnished 1BHK available for 6 months. Near tech parks and restaurants. Perfect for professionals or students.",
      type: "subletting",
      price: 18000,
      location: "HSR Layout, Bangalore",
      room_type: "1BHK",
      amenities: ["Fully Furnished", "AC", "WiFi", "Gym", "Swimming Pool"],
      images: [],
      is_active: true,
      created_at: "2024-01-13T09:20:00Z",
      updated_at: "2024-01-13T09:20:00Z",
      username: "current_user",
      full_name: "You",
      avatar_url: ""
    }
  };

  // Dummy conversations data for requests
  const dummyConversations: Conversation[] = [
    {
      conversation_id: 1,
      post_id: 1,
      post_title: "Looking for a roommate in Koramangala",
      post_type: "roommate",
      other_user_id: 2,
      other_username: "priya_sharma",
      other_full_name: "Priya Sharma",
      other_avatar_url: "",
      conversation_created_at: "2024-01-15T14:20:00Z",
      last_message: "Hi! I'm interested in your roommate post. Is it still available?",
      last_message_time: "2024-01-15T14:20:00Z",
      unread_count: 2
    },
    {
      conversation_id: 2,
      post_id: 1,
      post_title: "Looking for a roommate in Koramangala",
      post_type: "roommate",
      other_user_id: 3,
      other_username: "kavya_iyer",
      other_full_name: "Kavya Iyer",
      other_avatar_url: "",
      conversation_created_at: "2024-01-15T16:30:00Z",
      last_message: "I'm a student at Christ University. Would love to see the apartment!",
      last_message_time: "2024-01-15T16:30:00Z",
      unread_count: 1
    },
    {
      conversation_id: 3,
      post_id: 2,
      post_title: "Single room available in Indiranagar",
      post_type: "room",
      other_user_id: 4,
      other_username: "aditya_malhotra",
      other_full_name: "Aditya Malhotra",
      other_avatar_url: "",
      conversation_created_at: "2024-01-14T17:45:00Z",
      last_message: "Hi! I'm interested in the room. When can I visit?",
      last_message_time: "2024-01-14T17:45:00Z",
      unread_count: 0
    },
    {
      conversation_id: 4,
      post_id: 3,
      post_title: "Subletting my 1BHK in HSR Layout",
      post_type: "subletting",
      other_user_id: 5,
      other_username: "neha_gupta",
      other_full_name: "Neha Gupta",
      other_avatar_url: "",
      conversation_created_at: "2024-01-13T11:20:00Z",
      last_message: "Perfect timing! I need a place for 6 months. Can we arrange a viewing?",
      last_message_time: "2024-01-13T11:20:00Z",
      unread_count: 0
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchPostAndRequests();
    }
  }, [id, isAuthenticated, router]);

  const fetchPostAndRequests = async () => {
    try {
      setLoading(true);
      
      // Use dummy data instead of API calls
      const postId = Array.isArray(id) ? id[0] : id;
      if (!postId) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }
      
      const postData = dummyPosts[postId];
      if (!postData) {
        setError('Post not found');
        setLoading(false);
        return;
      }
      
      setPost(postData);

      // Filter conversations for this post
      const postConversations = dummyConversations.filter((conv: Conversation) => conv.post_id === parseInt(postId));
      setConversations(postConversations);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load requests');
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (conversationId: number) => {
    try {
      // Simulate accepting request
      alert('Request accepted! A message has been sent to the requester.');
      
      // Update conversation status
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === conversationId 
          ? { ...conv, last_message: "I've accepted your request. Let's discuss further details." }
          : conv
      ));
    } catch (err) {
      setError('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (conversationId: number) => {
    try {
      // Simulate declining request
      alert('Request declined. A message has been sent to the requester.');
      
      // Update conversation status
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === conversationId 
          ? { ...conv, last_message: "I'm sorry, but I've decided to decline your request." }
          : conv
      ));
    } catch (err) {
      setError('Failed to decline request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E4075]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
          {error}
        </div>
        <div className="mt-4 text-center">
          <Link href="/rooms" className="text-[#5E4075] font-medium hover:underline">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] pb-20">
      <div className="px-4 pt-6">
        <div className="flex items-center mb-6">
          <Link href={`/rooms/${id}`} className="mr-2">
            <i className="ri-arrow-left-line text-[#5E4075] text-lg"></i>
          </Link>
          <h1 className="text-xl font-bold text-[#5E4075]">Requests for Your Post</h1>
        </div>

        {post && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="text-lg font-semibold text-[#5E4075] mb-2">{post.title}</h2>
            <div className="flex items-center mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                post.type === 'roommate' ? 'bg-[#E1D2FF]' : 
                post.type === 'room' ? 'bg-[#FEFDD0]' : 
                'bg-[#FFDCE8]'} text-[#5E4075] mr-2`}>
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
              <span className="text-xs text-gray-500">{post.location || 'Location not specified'}</span>
            </div>
            <p className="text-sm text-gray-600">₹{post.price.toLocaleString()}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-[#5E4075] mb-4">Interested Users</h3>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="w-16 h-16 bg-[#E1D2FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-search-line text-[#5E4075] text-2xl"></i>
            </div>
            <h3 className="text-[#5E4075] font-semibold mb-2">No requests yet</h3>
            <p className="text-gray-500 text-sm mb-4">When someone expresses interest in your post, you'll see their request here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.conversation_id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E1D2FF] flex items-center justify-center mr-2 overflow-hidden">
                    {conversation.other_avatar_url ? (
                      <img src={conversation.other_avatar_url} alt={conversation.other_username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg text-[#5E4075] font-bold">
                        {conversation.other_full_name?.charAt(0) || conversation.other_username?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#5E4075] text-sm">{conversation.other_full_name || conversation.other_username}</p>
                    <p className="text-xs text-gray-500">{new Date(conversation.conversation_created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700">{conversation.last_message}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleAcceptRequest(conversation.conversation_id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium text-center hover:bg-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(conversation.conversation_id)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-medium text-center hover:bg-gray-300 transition-colors"
                  >
                    Decline
                  </button>
                  <Link 
                    href={`/messages?conversation=${conversation.conversation_id}`}
                    className="flex-1 bg-[#5E4075] text-white py-2 rounded-xl font-medium text-center hover:bg-[#4A335F] transition-colors"
                  >
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}