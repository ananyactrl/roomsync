'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

type SignupMethod = 'email' | 'phone' | 'google' | 'facebook';

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  university: string;
  major: string;
  year: string;
  otp: string;
}

export default function RegisterPage() {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('email');
  const [step, setStep] = useState<'form' | 'otp' | 'verification'>('form');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    university: '',
    major: '',
    year: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Password strength validation
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const validatePassword = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (signupMethod === 'email' && !formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (signupMethod === 'phone' && !formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!validatePassword()) {
      setError('Password does not meet requirements');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (formData.otp === '123456') { // Demo OTP
        setStep('verification');
        await handleRegistration();
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const userData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      full_name: formData.full_name,
      university: formData.university,
      major: formData.major,
      year: parseInt(formData.year) || null
    };

    try {
      const result = await register(userData);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (signupMethod === 'phone') {
      await sendOTP();
    } else if (signupMethod === 'email') {
      await handleRegistration();
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate OAuth signup
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In real implementation, redirect to OAuth provider
      console.log(`Signing up with ${provider}`);
    } catch (err) {
      setError(`Failed to sign up with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Verify Your Phone</h1>
            <p className="text-gray-600">Enter the 6-digit code sent to {formData.phone}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || formData.otp.length !== 6}
                className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-wisteria-600 text-sm hover:underline"
                >
                  ← Back to form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Join RoomSync</h1>
          <p className="text-gray-600">Create your account to start connecting</p>
        </div>

        {/* Signup Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-wisteria-700 mb-4">Choose Signup Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSignupMethod('email')}
              className={`p-3 rounded-xl border-2 transition-colors ${
                signupMethod === 'email'
                  ? 'border-wisteria-500 bg-wisteria-50 text-wisteria-700'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300'
              }`}
            >
              <i className="ri-mail-line text-xl mb-2"></i>
              <div className="text-sm font-medium">Email</div>
            </button>
            <button
              onClick={() => setSignupMethod('phone')}
              className={`p-3 rounded-xl border-2 transition-colors ${
                signupMethod === 'phone'
                  ? 'border-wisteria-500 bg-wisteria-50 text-wisteria-700'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300'
              }`}
            >
              <i className="ri-phone-line text-xl mb-2"></i>
              <div className="text-sm font-medium">Phone</div>
            </button>
          </div>
        </div>

        {/* OAuth Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-gray-500 text-sm">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthSignup('google')}
              disabled={loading}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <i className="ri-google-fill text-red-500"></i>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleOAuthSignup('facebook')}
              disabled={loading}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <i className="ri-facebook-fill text-blue-600"></i>
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>

            {signupMethod === 'email' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {signupMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Your university"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
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
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Your major"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Create a password"
              />
              
              {/* Password Strength Indicator */}
              <div className="mt-2 space-y-1">
                <div className={`flex items-center space-x-2 text-xs ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                  <i className={`ri-${passwordStrength.length ? 'check-line' : 'close-line'}`}></i>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 text-xs ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <i className={`ri-${passwordStrength.uppercase ? 'check-line' : 'close-line'}`}></i>
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 text-xs ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  <i className={`ri-${passwordStrength.lowercase ? 'check-line' : 'close-line'}`}></i>
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 text-xs ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                  <i className={`ri-${passwordStrength.number ? 'check-line' : 'close-line'}`}></i>
                  <span>One number</span>
                </div>
                <div className={`flex items-center space-x-2 text-xs ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                  <i className={`ri-${passwordStrength.special ? 'check-line' : 'close-line'}`}></i>
                  <span>One special character</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : signupMethod === 'phone' ? 'Send OTP' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-wisteria-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-wisteria-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 