// Smart Matching Algorithm Service

// Weight configurations
const WEIGHTS = {
  LOCATION: 0.30,    // 30%
  BUDGET: 0.25,      // 25%
  LIFESTYLE: 0.25,   // 25%
  ACADEMIC: 0.20     // 20%
};

// Location compatibility scoring
const calculateLocationScore = (userLocation, targetLocation) => {
  if (userLocation === targetLocation) return 100;
  
  // In a real implementation, you would use a geocoding service
  // to calculate actual distances. For now, we'll simulate this.
  const distanceMap = {
    'Mumbai': { 'Thane': 20, 'Navi Mumbai': 15, 'Pune': 150 },
    'Delhi': { 'Gurgaon': 25, 'Noida': 20, 'Faridabad': 30 },
    'Bangalore': { 'Electronic City': 20, 'Whitefield': 25, 'Marathahalli': 15 },
    'Hyderabad': { 'Gachibowli': 15, 'Hitech City': 10, 'Secunderabad': 20 },
    'Chennai': { 'OMR': 25, 'ECR': 30, 'Tambaram': 20 },
    'Pune': { 'Hinjewadi': 20, 'Kharadi': 15, 'Wakad': 25 }
  };
  
  const distance = distanceMap[userLocation]?.[targetLocation] || 50;
  
  if (distance <= 5) return 80;
  if (distance <= 10) return 60;
  if (distance <= 20) return 40;
  return 20;
};

// Budget compatibility scoring
const calculateBudgetScore = (userBudget, targetBudget) => {
  const userMin = userBudget.min || 0;
  const userMax = userBudget.max || 0;
  const targetMin = targetBudget.min || 0;
  const targetMax = targetBudget.max || 0;
  
  // Calculate overlap
  const overlapStart = Math.max(userMin, targetMin);
  const overlapEnd = Math.min(userMax, targetMax);
  
  if (overlapEnd < overlapStart) return 0; // No overlap
  
  const overlap = overlapEnd - overlapStart;
  const userRange = userMax - userMin;
  const targetRange = targetMax - targetMin;
  const totalRange = Math.max(userRange, targetRange);
  
  return Math.round((overlap / totalRange) * 100);
};

// Lifestyle compatibility scoring
const calculateLifestyleScore = (userLifestyle, targetLifestyle) => {
  let score = 0;
  let totalFactors = 0;
  
  // Sleep schedule compatibility
  if (userLifestyle.sleep_schedule && targetLifestyle.sleep_schedule) {
    totalFactors++;
    if (userLifestyle.sleep_schedule === targetLifestyle.sleep_schedule) {
      score += 100;
    } else if (
      (userLifestyle.sleep_schedule === 'early_bird' && targetLifestyle.sleep_schedule === 'night_owl') ||
      (userLifestyle.sleep_schedule === 'night_owl' && targetLifestyle.sleep_schedule === 'early_bird')
    ) {
      score += 30; // Low compatibility
    } else {
      score += 60; // Medium compatibility
    }
  }
  
  // Cleanliness level
  if (userLifestyle.cleanliness_level && targetLifestyle.cleanliness_level) {
    totalFactors++;
    if (userLifestyle.cleanliness_level === targetLifestyle.cleanliness_level) {
      score += 100;
    } else if (
      (userLifestyle.cleanliness_level === 'very_clean' && targetLifestyle.cleanliness_level === 'relaxed') ||
      (userLifestyle.cleanliness_level === 'relaxed' && targetLifestyle.cleanliness_level === 'very_clean')
    ) {
      score += 20; // Low compatibility
    } else {
      score += 70; // Medium compatibility
    }
  }
  
  // Study habits
  if (userLifestyle.study_habits && targetLifestyle.study_habits) {
    totalFactors++;
    if (userLifestyle.study_habits === targetLifestyle.study_habits) {
      score += 100;
    } else if (
      (userLifestyle.study_habits === 'library_studier' && targetLifestyle.study_habits === 'room_studier') ||
      (userLifestyle.study_habits === 'room_studier' && targetLifestyle.study_habits === 'library_studier')
    ) {
      score += 40; // Lower compatibility
    } else {
      score += 80; // Higher compatibility
    }
  }
  
  // Social preferences
  if (userLifestyle.social_preferences && targetLifestyle.social_preferences) {
    totalFactors++;
    if (userLifestyle.social_preferences === targetLifestyle.social_preferences) {
      score += 100;
    } else if (
      (userLifestyle.social_preferences === 'very_social' && targetLifestyle.social_preferences === 'prefer_quiet') ||
      (userLifestyle.social_preferences === 'prefer_quiet' && targetLifestyle.social_preferences === 'very_social')
    ) {
      score += 25; // Low compatibility
    } else {
      score += 75; // Medium compatibility
    }
  }
  
  // Food preferences
  if (userLifestyle.food_preference && targetLifestyle.food_preference) {
    totalFactors++;
    if (userLifestyle.food_preference === targetLifestyle.food_preference) {
      score += 100;
    } else if (
      (userLifestyle.food_preference === 'vegetarian' && targetLifestyle.food_preference === 'non_vegetarian') ||
      (userLifestyle.food_preference === 'non_vegetarian' && targetLifestyle.food_preference === 'vegetarian')
    ) {
      score += 30; // Lower compatibility
    } else {
      score += 80; // Higher compatibility
    }
  }
  
  // Guest policy
  if (userLifestyle.guest_policy && targetLifestyle.guest_policy) {
    totalFactors++;
    if (userLifestyle.guest_policy === targetLifestyle.guest_policy) {
      score += 100;
    } else if (
      (userLifestyle.guest_policy === 'frequent_guests_okay' && targetLifestyle.guest_policy === 'prefer_no_guests') ||
      (userLifestyle.guest_policy === 'prefer_no_guests' && targetLifestyle.guest_policy === 'frequent_guests_okay')
    ) {
      score += 20; // Low compatibility
    } else {
      score += 70; // Medium compatibility
    }
  }
  
  return totalFactors > 0 ? Math.round(score / totalFactors) : 0;
};

// Academic compatibility scoring
const calculateAcademicScore = (userAcademic, targetAcademic) => {
  let score = 0;
  
  // Same college bonus
  if (userAcademic.university === targetAcademic.university) {
    score += 40;
  }
  
  // Same course/field
  if (userAcademic.course === targetAcademic.course) {
    score += 30;
  }
  
  // Same year
  if (userAcademic.year === targetAcademic.year) {
    score += 20;
  }
  
  // Same accommodation status
  if (userAcademic.accommodation_status === targetAcademic.accommodation_status) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

// Main matching function
export const calculateCompatibilityScore = (userProfile, targetProfile) => {
  // Location compatibility
  const locationScore = calculateLocationScore(
    userProfile.preferred_locations?.[0], 
    targetProfile.preferred_locations?.[0]
  );
  
  // Budget compatibility
  const budgetScore = calculateBudgetScore(
    { min: userProfile.budget_min, max: userProfile.budget_max },
    { min: targetProfile.budget_min, max: targetProfile.budget_max }
  );
  
  // Lifestyle compatibility
  const lifestyleScore = calculateLifestyleScore(
    {
      sleep_schedule: userProfile.sleep_schedule,
      cleanliness_level: userProfile.cleanliness_level,
      study_habits: userProfile.study_habits,
      social_preferences: userProfile.social_preferences,
      food_preference: userProfile.food_preference,
      guest_policy: userProfile.guest_policy
    },
    {
      sleep_schedule: targetProfile.sleep_schedule,
      cleanliness_level: targetProfile.cleanliness_level,
      study_habits: targetProfile.study_habits,
      social_preferences: targetProfile.social_preferences,
      food_preference: targetProfile.food_preference,
      guest_policy: targetProfile.guest_policy
    }
  );
  
  // Academic compatibility
  const academicScore = calculateAcademicScore(
    {
      university: userProfile.university,
      course: userProfile.course,
      year: userProfile.year,
      accommodation_status: userProfile.accommodation_status
    },
    {
      university: targetProfile.university,
      course: targetProfile.course,
      year: targetProfile.year,
      accommodation_status: targetProfile.accommodation_status
    }
  );
  
  // Calculate weighted total score
  const totalScore = Math.round(
    (locationScore * WEIGHTS.LOCATION) +
    (budgetScore * WEIGHTS.BUDGET) +
    (lifestyleScore * WEIGHTS.LIFESTYLE) +
    (academicScore * WEIGHTS.ACADEMIC)
  );
  
  return {
    totalScore,
    breakdown: {
      location: { score: locationScore, weight: WEIGHTS.LOCATION },
      budget: { score: budgetScore, weight: WEIGHTS.BUDGET },
      lifestyle: { score: lifestyleScore, weight: WEIGHTS.LIFESTYLE },
      academic: { score: academicScore, weight: WEIGHTS.ACADEMIC }
    }
  };
};

// Get compatibility level description
export const getCompatibilityLevel = (score) => {
  if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
  if (score >= 80) return { level: 'Very Good', color: 'text-green-500', bg: 'bg-green-50' };
  if (score >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  if (score >= 50) return { level: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { level: 'Very Poor', color: 'text-red-600', bg: 'bg-red-100' };
};

// Find best matches for a user
export const findBestMatches = (userProfile, allProfiles, limit = 10) => {
  const matches = allProfiles
    .filter(profile => profile.id !== userProfile.id) // Exclude self
    .map(profile => ({
      profile,
      compatibility: calculateCompatibilityScore(userProfile, profile)
    }))
    .sort((a, b) => b.compatibility.totalScore - a.compatibility.totalScore)
    .slice(0, limit);
  
  return matches;
}; 