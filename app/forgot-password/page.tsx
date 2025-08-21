'use client';

import { useState } from 'react';
import Link from 'next/link';

type ResetStep = 'email' | 'otp' | 'new-password';

interface ResetData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email');
  const [resetData, setResetData] = useState<ResetData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
    
    // Password strength validation
    if (name === 'newPassword') {
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

  const sendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      setSuccess('Reset code sent to your email!');
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (resetData.otp === '123456') { // Demo OTP
        setStep('new-password');
      } else {
        setError('Invalid reset code');
      }
    } catch (err) {
      setError('Failed to verify reset code');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!validatePassword()) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Enter Reset Code</h1>
            <p className="text-gray-600">We've sent a 6-digit code to {resetData.email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={verifyOTP} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  name="otp"
                  value={resetData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || resetData.otp.length !== 6}
                className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-wisteria-600 text-sm hover:underline"
                >
                  ← Back to email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'new-password') {
    return (
      <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Set New Password</h1>
            <p className="text-gray-600">Create a strong password for your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={resetPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Enter new password"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={resetData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lemon-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wisteria-700 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email to receive a reset code</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={sendResetEmail} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={resetData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wisteria-500 text-white py-3 rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-wisteria-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-wisteria-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 