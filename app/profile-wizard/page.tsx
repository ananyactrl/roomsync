'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

type WizardStep = 1 | 2 | 3 | 4;

interface ProfileData {
  // Step 1: Basic Information
  full_name: string;
  age: string;
  gender: string;
  university: string;
  course: string;
  year: string;
  accommodation_status: string;
  
  // Step 2: Accommodation Preferences
  preferred_locations: string[];
  budget_min: number;
  budget_max: number;
  room_type: string;
  move_in_date: string;
  lease_duration: string;
  
  // Step 3: Lifestyle Preferences
  sleep_schedule: string;
  cleanliness_level: string;
  study_habits: string;
  social_preferences: string;
  smoking_preference: string;
  drinking_preference: string;
  food_preference: string;
  cooking_habits: string;
  guest_policy: string;
  
  // Step 4: Photos & Verification
  profile_photos: File[];
  college_id: File | null;
  social_media: {
    instagram: string;
    linkedin: string;
    facebook: string;
  };
}

const INDIAN_UNIVERSITIES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT BHU', 'IIT ISM Dhanbad',
  'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela',
  'BITS Pilani', 'BITS Goa', 'BITS Hyderabad', 'Delhi University', 'Mumbai University',
  'Jadavpur University', 'Anna University', 'VIT Vellore', 'SRM University', 'MIT Pune',
  'MIT AOE', 'Other'
];

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar'
];

export default function ProfileWizardPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    // Step 1
    full_name: '',
    age: '',
    gender: '',
    university: '',
    course: '',
    year: '',
    accommodation_status: '',
    
    // Step 2
    preferred_locations: [],
    budget_min: 5000,
    budget_max: 15000,
    room_type: '',
    move_in_date: '',
    lease_duration: '',
    
    // Step 3
    sleep_schedule: '',
    cleanliness_level: '',
    study_habits: '',
    social_preferences: '',
    smoking_preference: '',
    drinking_preference: '',
    food_preference: '',
    cooking_habits: '',
    guest_policy: '',
    
    // Step 4
    profile_photos: [],
    college_id: null,
    social_media: {
      instagram: '',
      linkedin: '',
      facebook: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const handleLocationToggle = (location: string) => {
    setProfileData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.includes(location)
        ? prev.preferred_locations.filter(l => l !== location)
        : [...prev.preferred_locations, location]
    }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (files) {
      const newPhotos = Array.from(files);
      setProfileData(prev => ({
        ...prev,
        profile_photos: [...prev.profile_photos, ...newPhotos].slice(0, 5)
      }));
    }
  };

  const removePhoto = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      profile_photos: prev.profile_photos.filter((_, i) => i !== index)
    }));
  };

  const handleCollegeIdUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setProfileData(prev => ({ ...prev, college_id: files[0] }));
    }
  };

  const validateStep = (step: WizardStep): boolean => {
    switch (step) {
      case 1:
        return !!(profileData.full_name && profileData.age && profileData.gender && 
                 profileData.university && profileData.course && profileData.year && 
                 profileData.accommodation_status);
      case 2:
        return !!(profileData.preferred_locations.length > 0 && profileData.room_type && 
                 profileData.move_in_date && profileData.lease_duration);
      case 3:
        return !!(profileData.sleep_schedule && profileData.cleanliness_level && 
                 profileData.study_habits && profileData.social_preferences && 
                 profileData.food_preference && profileData.guest_policy);
      case 4:
        return profileData.profile_photos.length >= 1;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => (prev + 1) as WizardStep);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as WizardStep);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate profile creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, send profileData to backend
      console.log('Profile data:', profileData);
      
      // Redirect to profile page
      router.push('/profile');
    } catch (err) {
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-wisteria-500 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-wisteria-500' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-wisteria-700 mb-6">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={profileData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
          <input
            type="number"
            value={profileData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            placeholder="Enter your age"
            min="16"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
          <select
            value={profileData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select university</option>
            {INDIAN_UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course/Branch *</label>
          <input
            type="text"
            value={profileData.course}
            onChange={(e) => handleInputChange('course', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
            placeholder="e.g., Computer Science, Mechanical"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
          <select
            value={profileData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5">5th Year+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Accommodation Status *</label>
        <select
          value={profileData.accommodation_status}
          onChange={(e) => handleInputChange('accommodation_status', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
        >
          <option value="">Select status</option>
          <option value="looking_for_room">Looking for a room</option>
          <option value="have_room">Have a room, looking for roommate</option>
          <option value="want_to_swap">Want to swap rooms</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-wisteria-700 mb-6">Accommodation Preferences</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Locations *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INDIAN_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleLocationToggle(city)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                profileData.preferred_locations.includes(city)
                  ? 'border-wisteria-500 bg-wisteria-50 text-wisteria-700'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget Range: ₹{profileData.budget_min.toLocaleString()} - ₹{profileData.budget_max.toLocaleString()}
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="3000"
            max="25000"
            step="1000"
            value={profileData.budget_max}
            onChange={(e) => handleInputChange('budget_max', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹3,000</span>
            <span>₹25,000</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type Preference *</label>
          <select
            value={profileData.room_type}
            onChange={(e) => handleInputChange('room_type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select room type</option>
            <option value="single">Single Room</option>
            <option value="shared">Shared Room (2 people)</option>
            <option value="3_sharing">3-Sharing</option>
            <option value="4_sharing">4-Sharing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration *</label>
          <select
            value={profileData.lease_duration}
            onChange={(e) => handleInputChange('lease_duration', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select duration</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="1_year">1 Year</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Move-in Date *</label>
        <input
          type="date"
          value={profileData.move_in_date}
          onChange={(e) => handleInputChange('move_in_date', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-wisteria-700 mb-6">Lifestyle Preferences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Schedule *</label>
          <select
            value={profileData.sleep_schedule}
            onChange={(e) => handleInputChange('sleep_schedule', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select sleep schedule</option>
            <option value="early_bird">Early Bird (9-11 PM)</option>
            <option value="night_owl">Night Owl (11 PM-2 AM)</option>
            <option value="very_late">Very Late (2+ AM)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cleanliness Level *</label>
          <select
            value={profileData.cleanliness_level}
            onChange={(e) => handleInputChange('cleanliness_level', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select cleanliness level</option>
            <option value="very_clean">Very Clean</option>
            <option value="moderately_clean">Moderately Clean</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Study Habits *</label>
          <select
            value={profileData.study_habits}
            onChange={(e) => handleInputChange('study_habits', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select study habits</option>
            <option value="library_studier">Library Studier</option>
            <option value="room_studier">Room Studier</option>
            <option value="group_studier">Group Studier</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Social Preferences *</label>
          <select
            value={profileData.social_preferences}
            onChange={(e) => handleInputChange('social_preferences', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select social preference</option>
            <option value="very_social">Very Social</option>
            <option value="moderately_social">Moderately Social</option>
            <option value="prefer_quiet">Prefer Quiet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Preference</label>
          <select
            value={profileData.smoking_preference}
            onChange={(e) => handleInputChange('smoking_preference', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select preference</option>
            <option value="non_smoker">Non-smoker</option>
            <option value="occasional_smoker">Occasional smoker</option>
            <option value="regular_smoker">Regular smoker</option>
            <option value="dont_mind">Don't mind</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drinking Preference</label>
          <select
            value={profileData.drinking_preference}
            onChange={(e) => handleInputChange('drinking_preference', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select preference</option>
            <option value="non_drinker">Non-drinker</option>
            <option value="occasional_drinker">Occasional drinker</option>
            <option value="regular_drinker">Regular drinker</option>
            <option value="dont_mind">Don't mind</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Preference *</label>
          <select
            value={profileData.food_preference}
            onChange={(e) => handleInputChange('food_preference', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select food preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Habits</label>
          <select
            value={profileData.cooking_habits}
            onChange={(e) => handleInputChange('cooking_habits', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select cooking habits</option>
            <option value="love_cooking">Love cooking</option>
            <option value="basic_cooking">Basic cooking</option>
            <option value="prefer_ordering">Prefer ordering</option>
            <option value="mess_food">Mess food</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guest Policy *</label>
          <select
            value={profileData.guest_policy}
            onChange={(e) => handleInputChange('guest_policy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          >
            <option value="">Select guest policy</option>
            <option value="frequent_guests_okay">Frequent guests okay</option>
            <option value="occasional_guests_okay">Occasional guests okay</option>
            <option value="prefer_no_guests">Prefer no guests</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-wisteria-700 mb-6">Photos & Verification</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Profile Photos * (3-5 photos, one must be clear face photo)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <i className="ri-image-add-line text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600">Click to upload photos</p>
          </label>
        </div>
        
        {profileData.profile_photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {profileData.profile_photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          College ID Upload (for verification)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleCollegeIdUpload(e.target.files)}
            className="hidden"
            id="college-id-upload"
          />
          <label htmlFor="college-id-upload" className="cursor-pointer">
            <i className="ri-file-upload-line text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600">Upload College ID</p>
          </label>
        </div>
        {profileData.college_id && (
          <p className="mt-2 text-sm text-green-600">
            ✓ {profileData.college_id.name} uploaded
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Social Media Profiles (optional)
        </label>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Instagram username"
            value={profileData.social_media.instagram}
            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          />
          <input
            type="text"
            placeholder="LinkedIn profile URL"
            value={profileData.social_media.linkedin}
            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          />
          <input
            type="text"
            placeholder="Facebook profile URL"
            value={profileData.social_media.facebook}
            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-lemon-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Create Your Profile</h1>
            <p className="text-gray-600">Complete your profile to find the perfect roommate</p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-wisteria-500 text-white rounded-xl font-medium hover:bg-wisteria-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-wisteria-500 text-white rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 