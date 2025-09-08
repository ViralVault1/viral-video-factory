import React, { useState } from 'react';

interface LicenseGeneratorPageProps {
  onNavigate: (page: string) => void;
}

export const LicenseGeneratorPage: React.FC<LicenseGeneratorPageProps> = ({ onNavigate }) => {
  const [licenseType, setLicenseType] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState('1-month');

  const licenseTypes = [
    { id: 'standard', name: 'Standard License', price: 29, features: ['Commercial use', 'Up to 10 videos', 'Basic support'] },
    { id: 'premium', name: 'Premium License', price: 79, features: ['Commercial use', 'Unlimited videos', 'Priority support', 'Custom branding'] },
    { id: 'enterprise', name: 'Enterprise License', price: 199, features: ['Commercial use', 'Unlimited videos', 'White-label rights', 'API access', 'Dedicated support'] }
  ];

  const selectedLicense = licenseTypes.find(l => l.id === licenseType);

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">License Generator</h1>
          <p className="text-gray-400">Generate and manage licenses for your team or clients</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">License Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">License Type</label>
                  <div className="space-y-3">
                    {licenseTypes.map((license) => (
                      <label key={license.id} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                        <input
                          type="radio"
                          name="licenseType"
                          value={license.id}
                          checked={licenseType === license.id}
                          onChange={(e) => setLicenseType(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{license.name}</span>
                            <span className="text-green-400 font-bold">${license.price}</span>
                          </div>
                          <ul className="text-sm text-gray-400 mt-1">
                            {license.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            
            {selectedLicense && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">{selectedLicense.name}</span>
                  <span className="text-white">${selectedLicense.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Quantity</span>
                  <span className="text-white">{quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white">{duration}</span>
                </div>
                
                <hr className="border-gray-700" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">${selectedLicense.price * quantity}</span>
                </div>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg mt-6">
                  Generate License
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
