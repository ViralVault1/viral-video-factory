import React, { useState } from 'react';
import { redeemLicenseKey } from '../services/licenseService';
import { useAuth } from '../contexts/AuthContext';

export const RedeemLicensePage: React.FC = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  
  const { user } = useAuth();

  const handleRedeemKey = async () => {
    if (!user) {
      setMessage('You must be logged in to redeem a license key');
      setMessageType('error');
      return;
    }

    if (!licenseKey.trim()) {
      setMessage('Please enter a license key');
      setMessageType('error');
      return;
    }

    // Validate license key format
    const licensePattern = /^VVF-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!licensePattern.test(licenseKey.toUpperCase())) {
      setMessage('Please enter a valid license key format (VVF-XXXX-XXXX-XXXX-XXXX)');
      setMessageType('error');
      return;
    }

    setIsRedeeming(true);
    setMessage('');

    try {
      // Call the real Supabase function
      const result = await redeemLicenseKey(licenseKey.toUpperCase());
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        setLicenseKey('');
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to redeem license key. Please try again.');
      setMessageType('error');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeemKey();
    }
  };

  const formatLicenseKey = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Add VVF prefix if not present
    let formatted = cleaned;
    if (!formatted.startsWith('VVF')) {
      formatted = 'VVF' + formatted;
    }
    
    // Format as VVF-XXXX-XXXX-XXXX-XXXX
    const parts = formatted.match(/.{1,4}/g) || [];
    return parts.slice(0, 5).join('-');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseKey(e.target.value);
    setLicenseKey(formatted);
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Redeem License</h1>
            <p className="text-gray-400 text-lg">
              Enter your promotional license key below to activate your premium access.
            </p>
          </div>

          {/* License Key Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License Key
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="VVF-XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={23}
                disabled={isRedeeming}
              />
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-900/50 border border-green-500 text-green-300' 
                  : 'bg-red-900/50 border border-red-500 text-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Redeem Button */}
            <button
              onClick={handleRedeemKey}
              disabled={isRedeeming || !licenseKey.trim() || !user}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isRedeeming ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Redeeming Key...
                </div>
              ) : (
                '✓ Redeem Key'
              )}
            </button>

            {!user && (
              <div className="text-center text-sm text-yellow-400">
                You must be logged in to redeem a license key
              </div>
            )}

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              <p>Don't have a license key? <a href="/pricing" className="text-green-400 hover:text-green-300">Upgrade your plan</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">SOLUTIONS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/api" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">PRODUCTS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/video-generator" className="hover:text-white">AI Video Generator</a></li>
                <li><a href="/auto-writer" className="hover:text-white">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">RESOURCES</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/guide" className="hover:text-white">User Guide</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-white font-semibold">Viral Video Factory</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Viral Video Factory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
