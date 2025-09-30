import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { createLicenseKey, LicenseKey } from '../services/licenseService';

export const LicenseGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [planPriceId, setPlanPriceId] = useState('price_premium');
  const [quantity, setQuantity] = useState(1);
  const [generatedLicenses, setGeneratedLicenses] = useState<LicenseKey[]>([]);
  const [generating, setGenerating] = useState(false);

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

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setGenerating(true);
    const newLicenses: LicenseKey[] = [];

    try {
      for (let i = 0; i < quantity; i++) {
        const license = await createLicenseKey(description, durationDays, planPriceId);
        newLicenses.push(license);
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
    const allLicenses = generatedLicenses.map(l => l.key_code).join('\n');
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
            <h1 className="text-3xl font-bold text-white">License Generator</h1>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
              ← Back to Home
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 30-day Premium Trial"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Plan Type</label>
              <select
                value={planPriceId}
                onChange={(e) => setPlanPriceId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price_trial">Trial</option>
                <option value="price_premium">Premium</option>
                <option value="price_pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                min="1"
                max="3650"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity (1-100)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max="100"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleGenerateLicenses}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? 'Generating...' : `Generate ${quantity} License(s)`}
            </button>

            {generatedLicenses.length > 0 && (
              <div className="mt-8 border-t border-gray-700 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Generated Licenses ({generatedLicenses.length})
                  </h2>
                  <button onClick={copyAllLicenses} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Copy All
                  </button>
                </div>
                <div className="space-y-2">
                  {generatedLicenses.map((license, index) => (
                    <div key={license.id || index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <div className="flex-1">
                        <code className="text-sm font-mono text-gray-200 block">{license.key_code}</code>
                        <span className="text-xs text-gray-400">{license.description}</span>
                      </div>
                      <button onClick={() => copyToClipboard(license.key_code)} className="ml-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
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
