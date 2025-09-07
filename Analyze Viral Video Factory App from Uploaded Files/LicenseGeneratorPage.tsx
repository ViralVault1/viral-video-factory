

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { createLicenseKey, getActiveLicenseKeys } from '../services/licenseService';
import { LicenseKey } from '../types';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { pricingPlans } from '../config/pricingConfig';
import { LicenseTemplateSelector } from './LicenseTemplateSelector';
import { LicenseTemplate } from '../config/licenseTemplates';

// For licenses, we default to the USD price ID.
const licenseablePlans = pricingPlans.monthly
    .filter(plan => plan.name !== 'Starter' && plan.cta !== 'Contact Sales')
    .map(plan => ({ name: plan.name, id: plan.priceIds.USD }));

interface LicenseGeneratorPageProps {
  onNavigate: (page: string) => void;
}

export const LicenseGeneratorPage: React.FC<LicenseGeneratorPageProps> = ({ onNavigate }) => {
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(14);
    const [selectedPlanId, setSelectedPlanId] = useState(licenseablePlans[0]?.id || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [generatedKey, setGeneratedKey] = useState<LicenseKey | null>(null);
    const [activeKeys, setActiveKeys] = useState<LicenseKey[]>([]);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    const { user, loading } = useAuth();
    const { showToast } = useNotification();
    
    // Admin check - simple implementation
    const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            showToast('You do not have permission to access this page.', 'error');
            onNavigate('home');
        } else if (isAdmin) {
            fetchKeys();
        }
    }, [user, loading, isAdmin, onNavigate]);

    const fetchKeys = async () => {
        setIsFetching(true);
        try {
            const keys = await getActiveLicenseKeys();
            setActiveKeys(keys);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsFetching(false);
        }
    };

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedPlanId.includes('_placeholder')) {
            showToast('Action required: Please update placeholder Stripe Price IDs in config/pricingConfig.ts before generating keys.', 'error');
            return;
        }

        setIsLoading(true);
        setGeneratedKey(null);
        try {
            const newKey = await createLicenseKey(description, duration, selectedPlanId);
            setGeneratedKey(newKey);
            showToast('License key generated successfully!', 'success');
            setDescription('');
            fetchKeys(); // Refresh the list
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (keyCode: string) => {
        navigator.clipboard.writeText(keyCode).then(() => {
            setCopiedKey(keyCode);
            showToast('Key copied to clipboard!', 'success');
            setTimeout(() => setCopiedKey(null), 2000);
        });
    };

    const handleSelectTemplate = (template: LicenseTemplate) => {
        setDescription(template.description);
        setDuration(template.duration === -1 ? 365 : template.duration); // Convert unlimited to 1 year
        if (template.planId) {
            setSelectedPlanId(template.planId);
        }
        setShowTemplateSelector(false);
        showToast(`Template "${template.name}" applied!`, 'success');
    };

    if (loading || !isAdmin) {
        return (
            <div className="py-20 px-4 flex justify-center items-center min-h-[50vh]">
                <LoaderIcon className="w-12 h-12 text-green-400" />
            </div>
        );
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">License Key Generator</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Create promotional license keys to grant temporary premium access.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Generator Form */}
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Create New Key</h2>
                            <button
                                type="button"
                                onClick={() => setShowTemplateSelector(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Use Template</span>
                            </button>
                        </div>
                        <form onSubmit={handleGenerateKey} className="space-y-6">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <input
                                    id="description" type="text" value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Black Friday 2024" required
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration (in days)</label>
                                <input
                                    id="duration" type="number" value={duration} min="1"
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    required
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="plan" className="block text-sm font-medium text-gray-300 mb-1">Plan</label>
                                <select
                                    id="plan" value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {licenseablePlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                                </select>
                            </div>
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <LoaderIcon /> : <SparklesIcon />}
                                <span>Generate Key</span>
                            </button>
                        </form>
                        {generatedKey && (
                            <div className="mt-6 bg-green-900/50 p-4 rounded-lg border border-green-500 text-center animate-fade-in">
                                <p className="text-sm text-green-300">Your new key:</p>
                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <code className="text-lg font-bold text-white">{generatedKey.key_code}</code>
                                    <button onClick={() => handleCopy(generatedKey.key_code)}>
                                        <ClipboardIcon isCopied={copiedKey === generatedKey.key_code} className="w-6 h-6 text-green-300 hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Keys List */}
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                         <h2 className="text-2xl font-bold text-white mb-6">Active Keys</h2>
                         {isFetching ? <div className="flex justify-center pt-10"><LoaderIcon /></div> : (
                             activeKeys.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {activeKeys.map(key => (
                                        <div key={key.id} className="bg-gray-900/70 p-3 rounded-lg flex items-center justify-between gap-2">
                                            <div>
                                                <code className="text-white font-semibold text-sm">{key.key_code}</code>
                                                <p className="text-xs text-gray-400">{key.description || `${key.duration_days} day trial`}</p>
                                            </div>
                                            <button onClick={() => handleCopy(key.key_code)}>
                                                <ClipboardIcon isCopied={copiedKey === key.key_code} className="w-5 h-5 text-gray-400 hover:text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <p className="text-gray-500 text-center pt-10">No active keys found.</p>
                             )
                         )}
                    </div>
                </div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <LicenseTemplateSelector
                    onSelectTemplate={handleSelectTemplate}
                    onClose={() => setShowTemplateSelector(false)}
                />
            )}
        </div>
    );
};