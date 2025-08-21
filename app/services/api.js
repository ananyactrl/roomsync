const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Phone OTP authentication
  sendOTP: (data) => apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  verifyOTP: (data) => apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  loginWithOTP: (data) => apiRequest('/auth/login-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // OAuth authentication
  loginWithOAuth: (provider) => apiRequest(`/auth/${provider}`, {
    method: 'GET',
  }),

  // Password reset
  resetPassword: (data) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  changePassword: (data) => apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Email verification
  sendVerificationEmail: (email) => apiRequest('/auth/send-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  verifyEmail: (token) => apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
};

// Posts API
export const postsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/posts?${params}`);
  },
  
  getById: (id) => apiRequest(`/posts/${id}`),
  
  create: (postData) => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),
  
  createWithImages: async (postData, files) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Add post data
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        if (Array.isArray(postData[key])) {
          // Handle arrays by joining with commas
          formData.append(key, postData[key].join(','));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });
    
    // Add files
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('images', file);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  },

  update: (id, postData) => apiRequest(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  }),

  delete: (id) => apiRequest(`/posts/${id}`, {
    method: 'DELETE',
  }),

  like: (id) => apiRequest(`/posts/${id}/like`, {
    method: 'POST',
  }),

  unlike: (id) => apiRequest(`/posts/${id}/unlike`, {
    method: 'DELETE',
  }),

  save: (id) => apiRequest(`/posts/${id}/save`, {
    method: 'POST',
  }),

  unsave: (id) => apiRequest(`/posts/${id}/unsave`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (profileData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  saveProfileWizard: (profileData) => apiRequest('/users/profile-wizard', {
    method: 'POST',
    body: JSON.stringify(profileData),
  }),

  getUserPosts: () => apiRequest('/users/posts'),
  
  uploadAvatar: async (file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  },
};

// Messages API
export const messagesAPI = {
  getConversations: () => apiRequest('/messages/conversations'),
  
  getMessages: (conversationId) => apiRequest(`/messages/conversations/${conversationId}`),
  
  sendMessage: (conversationId, content) => apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, content }),
  }),

  markAsRead: (messageId) => apiRequest(`/messages/${messageId}/read`, {
    method: 'PUT',
  }),
};

// Health check
export const healthCheck = () => apiRequest('/health'); 