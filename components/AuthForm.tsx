
import React, { useState } from 'react';
import { User } from '../types';
import { requestOtp, verifyOtp } from '../services/authService';

interface AuthFormProps {
  onLoginSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const response = await requestOtp(mobile);
    setLoading(false);
    if (response.success) {
      setOtpSent(true);
      setMessage(response.message);
    } else {
      setError(response.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!otp || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    const response = await verifyOtp(mobile, otp);
    setLoading(false);
    if (response.success && response.user) {
      onLoginSuccess(response.user);
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6 font-roboto-slab">
        {otpSent ? 'Verify OTP' : 'Login or Register'}
      </h2>
      
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}

      <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}>
        {!otpSent ? (
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile"
              maxLength={10}
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              disabled={loading} 
            />
          </div>
        ) : (
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="tel"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">OTP sent to {mobile}.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-150 disabled:opacity-70 flex items-center justify-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
        </button>
      </form>
      {otpSent && (
        <button 
          onClick={() => { setOtpSent(false); setError(null); setMessage(null); setOtp(''); }}
          className="mt-4 text-sm text-primary hover:underline text-center w-full"
          disabled={loading}
        >
          Change Mobile Number
        </button>
      )}
    </div>
  );
};

export default AuthForm;
