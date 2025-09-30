import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { licenseService } from '../services/LicenseService';

export const LicenseGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [licenseType, setLicenseType] = useState<'trial' | 'premium'>('trial');
  const [duration, setDuration] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [generatedLicenses, setGeneratedLicenses] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Redirect if not admin
  useEffect(() => {
    if (!checkingAdmin && (!user || !isAdmin)) {
      toast.error('You do not have permission to access this page.');
      navigate('/');
    }
  }, [checkingAdmin, user, isAdmin, navigate]);

  const handleGenerateLicenses = async () => {
    if (quantity < 1 || quantity > 100) {
      toast.error('Quantity must be between 1 and 100');
      return;
    }

    setGenerating(true);
    const newLicenses: string[] = [];

    try {
      for (let i = 0; i < quantity; i++) {
        const license = await licenseService.generateLicense(
          licenseType,
          duration
        );
        newLicenses.push(license.key);
      }

      setGeneratedLicenses(newLicenses);
      toast.success(`Successfully generated ${quantity} license(s)`);
    } catch (error) {
      console.error('Error generating licenses:', error);
      toast.error('Failed to generate licenses');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copyAllLicenses = () => {
    const allLicenses = generatedLicenses.join('\n');
    navigator.clipboard.writeText(allLicenses);
    toast.success('All licenses copied to clipboard');
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              License Generator
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          <div className="space-y-6">
            {/* License Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License Type
              </label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value as 'trial' | 'premium')}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="trial">Trial</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                min="1"
                max="3650"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity (1-100)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max="100"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateLicenses}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? 'Generating...' : `Generate ${quantity} License(s)`}
            </button>

            {/* Generated Licenses */}
            {generatedLicenses.length > 0 && (
              <div className="mt-8 border-t border-gray-700 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Generated Licenses ({generatedLicenses.length})
                  </h2>
                  <button
                    onClick={copyAllLicenses}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Copy All
                  </button>
                </div>
                <div className="space-y-2">
                  {generatedLicenses.map((license, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600"
                    >
                      <code className="text-sm font-mono text-gray-200">
                        {license}
                      </code>
                      <button
                        onClick={() => copyToClipboard(license)}
                        className="ml-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
