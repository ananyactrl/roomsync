
'use client';

import Link from 'next/link';
import { useState, useEffect, ChangeEvent, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

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

type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

function MessagesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  
  // Dummy conversations data
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
      conversation_created_at: "2024-01-15T10:30:00Z",
      last_message: "Hi! I'm interested in your roommate post. Is it still available?",
      last_message_time: "2024-01-15T14:20:00Z",
      unread_count: 2
    },
    {
      conversation_id: 2,
      post_id: 3,
      post_title: "Subletting my 1BHK in HSR Layout",
      post_type: "subletting",
      other_user_id: 4,
      other_username: "anjali_patel",
      other_full_name: "Anjali Patel",
      other_avatar_url: "",
      conversation_created_at: "2024-01-13T09:20:00Z",
      last_message: "Yes, the apartment is still available. When would you like to see it?",
      last_message_time: "2024-01-14T16:45:00Z",
      unread_count: 0
    },
    {
      conversation_id: 3,
      post_id: 2,
      post_title: "Single room available in Indiranagar",
      post_type: "room",
      other_user_id: 6,
      other_username: "rahul_verma",
      other_full_name: "Rahul Verma",
      other_avatar_url: "",
      conversation_created_at: "2024-01-14T15:45:00Z",
      last_message: "I've accepted your request. Let's discuss further details.",
      last_message_time: "2024-01-15T11:30:00Z",
      unread_count: 1
    },
    {
      conversation_id: 4,
      post_id: 5,
      post_title: "Studio apartment in Electronic City",
      post_type: "room",
      other_user_id: 8,
      other_username: "meera_reddy",
      other_full_name: "Meera Reddy",
      other_avatar_url: "",
      conversation_created_at: "2024-01-11T11:30:00Z",
      last_message: "The studio is perfect for me. Can we arrange a viewing?",
      last_message_time: "2024-01-12T13:15:00Z",
      unread_count: 0
    },
    {
      conversation_id: 5,
      post_id: 4,
      post_title: "Roommate needed in Whitefield",
      post_type: "roommate",
      other_user_id: 10,
      other_username: "vikram_singh",
      other_full_name: "Vikram Singh",
      other_avatar_url: "",
      conversation_created_at: "2024-01-12T14:15:00Z",
      last_message: "I'm sorry, but I've decided to decline your request.",
      last_message_time: "2024-01-13T10:20:00Z",
      unread_count: 0
    }
  ];

  // Dummy messages data
  const dummyMessages: { [key: number]: Message[] } = {
    1: [
      {
        id: 1,
        conversation_id: 1,
        sender_id: 2,
        content: "Hi! I'm interested in your roommate post. Is it still available?",
        is_read: true,
        created_at: "2024-01-15T14:20:00Z",
        username: "priya_sharma",
        full_name: "Priya Sharma",
        avatar_url: ""
      },
      {
        id: 2,
        conversation_id: 1,
        sender_id: 1,
        content: "Yes, it's still available! Are you a student or working professional?",
        is_read: true,
        created_at: "2024-01-15T14:25:00Z",
        username: "current_user",
        full_name: "You",
        avatar_url: ""
      },
      {
        id: 3,
        conversation_id: 1,
        sender_id: 2,
        content: "I'm a working professional at a tech company. When can I see the apartment?",
        is_read: false,
        created_at: "2024-01-15T14:30:00Z",
        username: "priya_sharma",
        full_name: "Priya Sharma",
        avatar_url: ""
      }
    ],
    2: [
      {
        id: 4,
        conversation_id: 2,
        sender_id: 1,
        content: "Hi! Is your 1BHK still available for subletting?",
        is_read: true,
        created_at: "2024-01-13T16:00:00Z",
        username: "current_user",
        full_name: "You",
        avatar_url: ""
      },
      {
        id: 5,
        conversation_id: 2,
        sender_id: 4,
        content: "Yes, the apartment is still available. When would you like to see it?",
        is_read: true,
        created_at: "2024-01-14T16:45:00Z",
        username: "anjali_patel",
        full_name: "Anjali Patel",
        avatar_url: ""
      }
    ],
    3: [
      {
        id: 6,
        conversation_id: 3,
        sender_id: 1,
        content: "Hi! I'm interested in the single room in Indiranagar.",
        is_read: true,
        created_at: "2024-01-14T16:00:00Z",
        username: "current_user",
        full_name: "You",
        avatar_url: ""
      },
      {
        id: 7,
        conversation_id: 3,
        sender_id: 6,
        content: "I've accepted your request. Let's discuss further details.",
        is_read: false,
        created_at: "2024-01-15T11:30:00Z",
        username: "rahul_verma",
        full_name: "Rahul Verma",
        avatar_url: ""
      }
    ]
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
      
      // Check if conversation ID is in URL params
      const conversationId = searchParams.get('conversation');
      if (conversationId) {
        setActiveConversation(parseInt(conversationId));
        fetchMessages(parseInt(conversationId));
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, searchParams]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Use dummy data instead of API call
      setConversations(dummyConversations);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      // Use dummy data instead of API call
      const conversationMessages = dummyMessages[conversationId] || [];
      setMessages(conversationMessages);
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    try {
      // Simulate sending message
      const newMsg: Message = {
        id: Date.now(),
        conversation_id: activeConversation,
        sender_id: 1, // Current user ID
        content: newMessage,
        is_read: false,
        created_at: new Date().toISOString(),
        username: "current_user",
        full_name: "You",
        avatar_url: ""
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === activeConversation 
          ? { ...conv, last_message: newMessage, last_message_time: new Date().toISOString() }
          : conv
      ));
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.post_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'roommate':
        return 'bg-wisteria-200 text-wisteria-700';
      case 'room':
        return 'bg-lemon-200 text-wisteria-700';
      case 'swap':
        return 'bg-wisteria-100 text-wisteria-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'roommate':
        return 'Roommate';
      case 'room':
        return 'Room';
      case 'swap':
        return 'Swap';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const getConversationStatus = (conversationId: number) => {
    const conversation = conversations.find(c => c.conversation_id === conversationId);
    return conversation?.unread_count || 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-4">Please log in to view messages</h1>
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
    <div className="min-h-screen bg-lemon-100">
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-wisteria-700 mb-3">Messages</h1>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            />
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="p-4 text-red-600 text-sm">{error}</div>
            )}
            
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations yet.</p>
                <p className="text-sm mt-1">Start a conversation by responding to a post!</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    activeConversation === conversation.conversation_id ? 'bg-wisteria-50' : ''
                  }`}
                  onClick={() => {
                    setActiveConversation(conversation.conversation_id);
                    fetchMessages(conversation.conversation_id);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-wisteria-200 rounded-full flex items-center justify-center">
                        <span className="text-wisteria-700 font-bold">
                          {conversation.other_full_name.charAt(0)}
                        </span>
                      </div>
                      {conversation.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-wisteria-700 truncate">
                          {conversation.other_full_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(conversation.last_message_time)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(conversation.post_type)}`}>
                          {getTypeLabel(conversation.post_type)}
                        </span>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.post_title}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.last_message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-wisteria-200 rounded-full flex items-center justify-center">
                    <span className="text-wisteria-700 font-bold">
                      {conversations.find(c => c.conversation_id === activeConversation)?.other_full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-wisteria-700">
                      {conversations.find(c => c.conversation_id === activeConversation)?.other_full_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.conversation_id === activeConversation)?.post_title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === 1 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === 1
                          ? 'bg-wisteria-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wisteria-300"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-wisteria-500 text-white rounded-lg hover:bg-wisteria-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <i className="ri-chat-3-line text-4xl mb-4 text-wisteria-300"></i>
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wisteria-600"></div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
