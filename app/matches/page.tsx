'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { findBestMatches, getCompatibilityLevel } from '../services/matching';
import Link from 'next/link';

export default function MatchesPage() {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfileAndMatches();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUserProfileAndMatches = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user profile
      const profile = await usersAPI.getProfile();
      setUserProfile(profile);
      
      // For demo purposes, we'll create some sample profiles
      // In real implementation, you'd fetch all profiles from backend
      const sampleProfiles = generateSampleProfiles();
      
      // Find best matches
      const bestMatches = findBestMatches(profile, sampleProfiles, 10);
      setMatches(bestMatches);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleProfiles = () => {
    return [
      {
        id: 1,
        full_name: 'Priya Sharma',
        age: '20',
        gender: 'female',
        university: 'MIT AOE',
        course: 'CSE',
        year: '3',
        accommodation_status: 'looking_for_room',
        preferred_locations: ['Pune'],
        budget_min: 8000,
        budget_max: 12000,
        sleep_schedule: 'early_bird',
        cleanliness_level: 'very_clean',
        study_habits: 'library_studier',
        social_preferences: 'moderately_social',
        food_preference: 'vegetarian',
        guest_policy: 'occasional_guests_okay'
      },
      {
        id: 2,
        full_name: 'Rahul Kumar',
        age: '21',
        gender: 'male',
        university: 'MIT AOE',
        course: 'Mechanical',
        year: '3',
        accommodation_status: 'have_room',
        preferred_locations: ['Pune'],
        budget_min: 6000,
        budget_max: 10000,
        sleep_schedule: 'night_owl',
        cleanliness_level: 'moderately_clean',
        study_habits: 'room_studier',
        social_preferences: 'very_social',
        food_preference: 'non_vegetarian',
        guest_policy: 'frequent_guests_okay'
      },
      {
        id: 3,
        full_name: 'Anjali Patel',
        age: '19',
        gender: 'female',
        university: 'MIT AOE',
        course: 'CSE',
        year: '2',
        accommodation_status: 'looking_for_room',
        preferred_locations: ['Pune'],
        budget_min: 7000,
        budget_max: 11000,
        sleep_schedule: 'early_bird',
        cleanliness_level: 'very_clean',
        study_habits: 'library_studier',
        social_preferences: 'prefer_quiet',
        food_preference: 'vegetarian',
        guest_policy: 'prefer_no_guests'
      },
      {
        id: 4,
        full_name: 'Vikram Singh',
        age: '22',
        gender: 'male',
        university: 'MIT AOE',
        course: 'CSE',
        year: '4',
        accommodation_status: 'want_to_swap',
        preferred_locations: ['Pune'],
        budget_min: 5000,
        budget_max: 9000,
        sleep_schedule: 'very_late',
        cleanliness_level: 'relaxed',
        study_habits: 'group_studier',
        social_preferences: 'very_social',
        food_preference: 'flexible',
        guest_policy: 'frequent_guests_okay'
      },
      {
        id: 5,
        full_name: 'Neha Gupta',
        age: '20',
        gender: 'female',
        university: 'MIT AOE',
        course: 'Electrical',
        year: '3',
        accommodation_status: 'looking_for_room',
        preferred_locations: ['Pune'],
        budget_min: 9000,
        budget_max: 15000,
        sleep_schedule: 'early_bird',
        cleanliness_level: 'very_clean',
        study_habits: 'library_studier',
        social_preferences: 'moderately_social',
        food_preference: 'vegetarian',
        guest_policy: 'occasional_guests_okay'
      }
    ];
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-4">Please log in to view your matches</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wisteria-600"></div>
        <p className="mt-4 text-wisteria-700">Finding your perfect matches...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-lemon-100">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-4">Complete Your Profile First</h1>
        <p className="text-gray-600 mb-6">We need your preferences to find the best matches for you.</p>
        <Link href="/profile-wizard" className="px-6 py-3 bg-wisteria-500 text-white rounded-xl font-medium hover:bg-wisteria-600 transition-colors">
          Complete Profile Wizard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lemon-100 pb-20">
      {/* Header */}
      <div className="bg-white rounded-b-3xl shadow p-6">
        <h1 className="text-2xl font-bold text-wisteria-700 mb-2">Your Matches</h1>
        <p className="text-gray-600">Based on your preferences, here are the best roommate matches for you</p>
      </div>

      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Matches List */}
      <div className="px-4 pt-6">
        {matches.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No matches found yet.</p>
            <p className="text-sm mt-2">Try updating your preferences or check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => {
              const compatibility = getCompatibilityLevel(match.compatibility.totalScore);
              return (
                <div key={match.profile.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Match Header */}
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-wisteria-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-wisteria-700">
                            {match.profile.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-wisteria-700">{match.profile.full_name}</h3>
                          <p className="text-sm text-gray-600">
                            {match.profile.age} years • {match.profile.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${compatibility.bg} ${compatibility.color}`}>
                          {compatibility.level}
                        </div>
                        <div className="text-2xl font-bold text-wisteria-700 mt-1">
                          {match.compatibility.totalScore}%
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Breakdown */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Location</div>
                        <div className="text-sm font-medium text-wisteria-700">
                          {match.compatibility.breakdown.location.score}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Budget</div>
                        <div className="text-sm font-medium text-wisteria-700">
                          {match.compatibility.breakdown.budget.score}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Lifestyle</div>
                        <div className="text-sm font-medium text-wisteria-700">
                          {match.compatibility.breakdown.lifestyle.score}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Academic</div>
                        <div className="text-sm font-medium text-wisteria-700">
                          {match.compatibility.breakdown.academic.score}%
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">University:</span>
                        <span className="font-medium text-wisteria-700">{match.profile.university}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Course:</span>
                        <span className="font-medium text-wisteria-700">{match.profile.course} ({match.profile.year} Year)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium text-wisteria-700">₹{match.profile.budget_min.toLocaleString()} - ₹{match.profile.budget_max.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-wisteria-700">
                          {match.profile.accommodation_status === 'looking_for_room' && 'Looking for room'}
                          {match.profile.accommodation_status === 'have_room' && 'Has room, needs roommate'}
                          {match.profile.accommodation_status === 'want_to_swap' && 'Wants to swap'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button className="flex-1 px-4 py-2 bg-wisteria-500 text-white rounded-lg text-sm font-medium hover:bg-wisteria-600 transition-colors">
                        <i className="ri-message-3-line mr-2"></i>
                        Message
                      </button>
                      <button className="flex-1 px-4 py-2 border border-wisteria-300 text-wisteria-700 rounded-lg text-sm font-medium hover:bg-wisteria-50 transition-colors">
                        <i className="ri-eye-line mr-2"></i>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 