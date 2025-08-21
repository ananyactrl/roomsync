'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

type LoginMethod = 'email' | 'phone';

interface LoginData {
  email: string;
  phone: string;
  password: string;
  otp: string;
}

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      if (loginData.otp === '123456') { // Demo OTP
        // In real implementation, verify OTP and login
        const result = await login(loginData.phone, loginData.otp, 'phone');
        if (result.success) {
          router.push('/');
        } else {
          setError(result.error);
        }
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginMethod === 'phone') {
        await sendOTP();
      } else {
        const result = await login(loginData.email, loginData.password);
        if (result.success) {
          router.push('/');
        } else {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate OAuth login
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In real implementation, redirect to OAuth provider
      console.log(`Logging in with ${provider}`);
    } catch (err) {
      setError(`Failed to login with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Verify Your Phone</h1>
            <p className="text-gray-600">Enter the 6-digit code sent to {loginData.phone}</p>
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
                  value={loginData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || loginData.otp.length !== 6}
                className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-wisteria-600 text-sm hover:underline"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your RoomSync account</p>
        </div>

        {/* Login Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-wisteria-700 mb-4">Choose Login Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLoginMethod('email')}
              className={`p-3 rounded-xl border-2 transition-colors ${
                loginMethod === 'email'
                  ? 'border-wisteria-500 bg-wisteria-50 text-wisteria-700'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300'
              }`}
            >
              <i className="ri-mail-line text-xl mb-2"></i>
              <div className="text-sm font-medium">Email</div>
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`p-3 rounded-xl border-2 transition-colors ${
                loginMethod === 'phone'
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
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <i className="ri-google-fill text-red-500"></i>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <i className="ri-facebook-fill text-blue-600"></i>
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loginMethod === 'email' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {loginMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={loginData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            {loginMethod === 'email' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : loginMethod === 'phone' ? 'Send OTP' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-wisteria-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {loginMethod === 'email' && (
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-wisteria-600 text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>
          )}
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