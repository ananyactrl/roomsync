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
      <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <i className="ri-phone-lock-line text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-wisteria-800 mb-4">Verify Your Phone</h1>
            <p className="text-gray-600">Enter the 6-digit code sent to {loginData.phone}</p>
          </div>

          <div className="card p-8">
            <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }} className="space-y-6">
              {error && (
                <div className="alert-error">
                  <i className="ri-error-warning-line mr-2"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">OTP Code</label>
                <input
                  type="text"
                  name="otp"
                  value={loginData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="input-modern text-center text-3xl tracking-widest font-bold"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || loginData.otp.length !== 6}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="spinner w-5 h-5"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-wisteria-600 hover:text-wisteria-700 font-medium transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-lemon-50 via-white to-wisteria-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-wisteria-400 to-wisteria-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <i className="ri-user-heart-line text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-wisteria-800 mb-4">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your RoomSync account</p>
        </div>

        {/* Enhanced Login Method Selection */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-wisteria-800 mb-4">Choose Login Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLoginMethod('email')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                loginMethod === 'email'
                  ? 'border-wisteria-500 bg-gradient-to-r from-wisteria-50 to-wisteria-100 text-wisteria-700 shadow-glow'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300 hover:bg-gray-50'
              }`}
            >
              <i className="ri-mail-line text-2xl mb-3"></i>
              <div className="text-sm font-semibold">Email</div>
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                loginMethod === 'phone'
                  ? 'border-wisteria-500 bg-gradient-to-r from-wisteria-50 to-wisteria-100 text-wisteria-700 shadow-glow'
                  : 'border-gray-200 text-gray-600 hover:border-wisteria-300 hover:bg-gray-50'
              }`}
            >
              <i className="ri-phone-line text-2xl mb-3"></i>
              <div className="text-sm font-semibold">Phone</div>
            </button>
          </div>
        </div>

        {/* Enhanced OAuth Options */}
        <div className="card p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-gray-500 text-sm">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <i className="ri-google-fill text-red-500 text-xl"></i>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
              className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <i className="ri-facebook-fill text-blue-600 text-xl"></i>
              <span className="text-sm font-semibold">Facebook</span>
            </button>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert-error">
                <i className="ri-error-warning-line mr-2"></i>
                <span>{error}</span>
              </div>
            )}

            {loginMethod === 'email' && (
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  className="input-modern"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {loginMethod === 'phone' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={loginData.phone}
                  onChange={handleChange}
                  required
                  className="input-modern"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            {loginMethod === 'email' && (
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="input-modern"
                  placeholder="Enter your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner w-5 h-5"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                loginMethod === 'phone' ? 'Send OTP' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-wisteria-600 font-semibold hover:text-wisteria-700 transition-colors">
                Sign up
              </Link>
            </p>

            {loginMethod === 'email' && (
              <div>
                <Link href="/forgot-password" className="text-wisteria-600 text-sm hover:text-wisteria-700 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-wisteria-600 hover:text-wisteria-700 font-medium transition-colors flex items-center justify-center space-x-2">
            <i className="ri-arrow-left-line"></i>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 