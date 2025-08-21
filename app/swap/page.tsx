
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SwapPage() {
  const [activeTab, setActiveTab] = useState('available');

  const swapRequests = [
    {
      id: 1,
      user: {
        name: "Emma Rodriguez",
        avatar: "https://readdy.ai/api/search-image?query=latina%20college%20student%20girl%20with%20curly%20hair%2C%20friendly%20expression%2C%20casual%20sweater%2C%20realistic%20portrait%20photography%2C%20warm%20lighting%2C%20campus%20background&width=48&height=48&seq=swap1&orientation=squarish",
        verified: true,
        year: "Sophomore"
      },
      currentRoom: {
        name: "West Hall Double",
        image: "https://readdy.ai/api/search-image?query=spacious%20college%20dorm%20room%20with%20two%20beds%2C%20study%20desks%2C%20modern%20furniture%2C%20good%20lighting%2C%20organized%20space%2C%20university%20dormitory%20interior&width=280&height=180&seq=swaproom1&orientation=landscape",
        features: ["Double Room", "Shared Bathroom", "Study Lounge", "Laundry"],
        rent: "$450/month"
      },
      desiredRoom: {
        location: "Engineering Building Area",
        type: "Single or Double",
        maxRent: "$500/month"
      },
      reason: "Need to be closer to engineering classes and labs. My current room is great but the commute is too long!",
      timeAgo: "2h ago",
      likes: 18,
      comments: 5,
      saved: false
    },
    {
      id: 2,
      user: {
        name: "Jordan Kim",
        avatar: "https://readdy.ai/api/search-image?query=asian%20college%20student%20with%20glasses%2C%20friendly%20expression%2C%20casual%20t-shirt%2C%20realistic%20portrait%20photography%2C%20warm%20lighting%2C%20university%20background&width=48&height=48&seq=swap2&orientation=squarish",
        verified: false,
        year: "Junior"
      },
      currentRoom: {
        name: "North Campus Suite",
        image: "https://readdy.ai/api/search-image?query=modern%20college%20suite%20with%20living%20area%2C%20bedroom%2C%20kitchenette%2C%20contemporary%20furniture%2C%20clean%20design%2C%20good%20lighting%2C%20spacious%20layout&width=280&height=180&seq=swaproom2&orientation=landscape",
        features: ["Suite", "Private Bathroom", "Kitchenette", "AC"],
        rent: "$700/month"
      },
      desiredRoom: {
        location: "South Campus",
        type: "Double Room",
        maxRent: "$500/month"
      },
      reason: "Looking to save money and be closer to my friends in South Campus. Willing to give up some amenities for better location!",
      timeAgo: "5h ago",
      likes: 12,
      comments: 8,
      saved: true
    },
    {
      id: 3,
      user: {
        name: "Marcus Johnson",
        avatar: "https://readdy.ai/api/search-image?query=college%20student%20guy%20with%20glasses%2C%20friendly%20smile%2C%20casual%20t-shirt%2C%20realistic%20portrait%20photography%2C%20natural%20lighting%2C%20university%20campus%20background&width=48&height=48&seq=swap3&orientation=squarish",
        verified: true,
        year: "Senior"
      },
      currentRoom: {
        name: "Library View Single",
        image: "https://readdy.ai/api/search-image?query=bright%20college%20dorm%20single%20room%20with%20large%20window%2C%20library%20view%2C%20study%20desk%2C%20bed%2C%20organized%20space%2C%20warm%20natural%20lighting%2C%20modern%20furnishings&width=280&height=180&seq=swaproom3&orientation=landscape",
        features: ["Single Room", "Great View", "Study Desk", "Quiet Floor"],
        rent: "$650/month"
      },
      desiredRoom: {
        location: "Athletic Complex Area",
        type: "Single Room",
        maxRent: "$650/month"
      },
      reason: "I'm on the track team and need to be closer to the gym for early morning practices. Great room for someone who studies a lot!",
      timeAgo: "1d ago",
      likes: 25,
      comments: 12,
      saved: false
    }
  ];

  const mySwapRequests = [
    {
      id: 1,
      status: "active",
      views: 45,
      likes: 8,
      comments: 3,
      timeAgo: "3d ago",
      currentRoom: "East Hall Double",
      desiredRoom: "West Campus Single"
    }
  ];

  return (
    <div className="min-h-screen bg-lemon-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-2">Room Swap</h1>
        <p className="text-gray-600 text-sm">Find students to swap rooms with</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'available'
                ? 'border-wisteria-500 text-wisteria-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Swaps
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'border-wisteria-500 text-wisteria-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Requests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'available' ? (
          <div className="space-y-6">
            {swapRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.user.avatar}
                        alt={request.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-wisteria-700 text-sm">{request.user.name}</span>
                          {request.user.verified && (
                            <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{request.user.year} • {request.timeAgo}</p>
                      </div>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center">
                      <i className={`${request.saved ? 'ri-bookmark-fill text-wisteria-600' : 'ri-bookmark-line text-gray-400'} text-lg`}></i>
                    </button>
                  </div>
                </div>

                {/* Room Details */}
                <div className="px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Room */}
                    <div>
                      <h3 className="font-semibold text-wisteria-700 text-sm mb-2">Current Room</h3>
                      <div className="bg-lemon-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{request.currentRoom.name}</span>
                          <span className="text-sm text-green-600 font-medium">{request.currentRoom.rent}</span>
                        </div>
                        <img
                          src={request.currentRoom.image}
                          alt="Current room"
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <div className="flex flex-wrap gap-1">
                          {request.currentRoom.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-lemon-200 text-wisteria-700 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desired Room */}
                    <div>
                      <h3 className="font-semibold text-wisteria-700 text-sm mb-2">Desired Room</h3>
                      <div className="bg-wisteria-50 rounded-lg p-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <i className="ri-map-pin-line text-wisteria-600"></i>
                            <span className="text-sm">{request.desiredRoom.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-home-line text-wisteria-600"></i>
                            <span className="text-sm">{request.desiredRoom.type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-price-tag-3-line text-wisteria-600"></i>
                            <span className="text-sm">{request.desiredRoom.maxRent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-4">
                    <h4 className="font-medium text-wisteria-700 text-sm mb-2">Reason for Swap</h4>
                    <p className="text-gray-700 text-sm">{request.reason}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-1">
                        <i className="ri-heart-line text-gray-600 text-lg"></i>
                        <span className="text-sm text-gray-600">{request.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <i className="ri-chat-1-line text-gray-600 text-lg"></i>
                        <span className="text-sm text-gray-600">{request.comments}</span>
                      </button>
                      <Link href="/messages" className="flex items-center space-x-1">
                        <i className="ri-send-plane-line text-gray-600 text-lg"></i>
                      </Link>
                    </div>
                    <button className="px-4 py-2 bg-wisteria-500 text-white rounded-lg text-sm font-medium hover:bg-wisteria-600 transition-colors">
                      Interested
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mySwapRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">{request.timeAgo}</span>
                  </div>
                  <button className="text-wisteria-600 text-sm font-medium">Edit</button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="text-sm font-medium text-wisteria-700">{request.currentRoom}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Desired:</span>
                    <span className="text-sm font-medium text-wisteria-700">{request.desiredRoom}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <i className="ri-eye-line"></i>
                    <span>{request.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-heart-line"></i>
                    <span>{request.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-chat-1-line"></i>
                    <span>{request.comments} comments</span>
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
