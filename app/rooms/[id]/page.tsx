'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsAPI, messagesAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [postOwner, setPostOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestStatus, setRequestStatus] = useState('pending'); // pending, accepted, declined
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const postData = await postsAPI.getById(id);
      setPost(postData);
      
      // Check if current user is the post owner
      if (isAuthenticated && user && postData.user_id === user.userId) {
        // This is the post owner
      } else if (postData.user_id) {
        // Fetch post owner details
        const ownerData = await usersAPI.getUserById(postData.user_id);
        setPostOwner(ownerData);
        
        // Check if the current user has already sent a request
        if (isAuthenticated && user) {
          try {
            const conversations = await messagesAPI.getConversations();
            const existingConversation = conversations.find(
              conv => conv.post_id === parseInt(id) && conv.other_user_id === postData.user_id
            );
            
            if (existingConversation) {
              setRequestSent(true);
              setConversationId(existingConversation.conversation_id);
              
              // Check for accept/decline messages
              const messages = await messagesAPI.getMessages(existingConversation.conversation_id);
              const acceptMessage = messages.find(msg => 
                msg.sender_id === postData.user_id && 
                msg.content.includes("accepted your request")
              );
              
              const declineMessage = messages.find(msg => 
                msg.sender_id === postData.user_id && 
                msg.content.includes("decline your request")
              );
              
              if (acceptMessage) {
                setRequestStatus('accepted');
              } else if (declineMessage) {
                setRequestStatus('declined');
              }
            }
          } catch (err) {
            console.error("Error checking conversation status:", err);
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load post details');
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(`/rooms/${id}`));
      return;
    }

    try {
      // Create a conversation which serves as the "request"
      const conversation = await messagesAPI.createConversation(id, post.user_id);
      setRequestSent(true);
      setConversationId(conversation.id);
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
                <img src={post.avatar_url} alt={post.username} className="w-full h-full object-cover" />
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
              <p className="text-sm font-bold text-green-700">₹{post.price}</p>
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
                {post.amenities.map((amenity, index) => (
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
                {post.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                    alt={`${post.title} - Image ${index + 1}`} 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
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
                href={`/rooms/${id}/edit`}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-center hover:bg-gray-300 transition-colors"
              >
                Edit Post
              </Link>
              <Link 
                href={`/rooms/${id}/requests`}
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