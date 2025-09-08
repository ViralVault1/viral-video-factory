import React, { useState } from 'react';
import { LicenseTemplate, licenseTemplates, getLicenseTemplatesByCategory, getCurrentSeasonalTemplates } from '../config/licenseTemplates';

interface LicenseTemplateSelectorProps {
  onSelectTemplate: (template: LicenseTemplate) => void;
  onClose: () => void;
}

export const LicenseTemplateSelector: React.FC<LicenseTemplateSelectorProps> = ({ 
  onSelectTemplate, 
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'seasonal', name: 'Seasonal', icon: '🎄' },
    { id: 'trial', name: 'Free Trials', icon: '🆓' },
    { id: 'promotion', name: 'Promotions', icon: '🎯' },
    { id: 'influencer', name: 'Influencer', icon: '⭐' },
    { id: 'partnership', name: 'Partnerships', icon: '🤝' },
    { id: 'enterprise', name: 'Enterprise', icon: '🏢' }
  ];

  const getFilteredTemplates = () => {
    let templates = selectedCategory === 'all' 
      ? licenseTemplates 
      : getLicenseTemplatesByCategory(selectedCategory as any);

    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.useCase.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return templates;
  };

  const currentSeasonalTemplates = getCurrentSeasonalTemplates();
  const filteredTemplates = getFilteredTemplates();

  const getCategoryColor = (category: string) => {
    const colors = {
      trial: 'bg-blue-100 text-blue-800',
      seasonal: 'bg-red-100 text-red-800',
      promotion: 'bg-purple-100 text-purple-800',
      influencer: 'bg-yellow-100 text-yellow-800',
      partnership: 'bg-green-100 text-green-800',
      enterprise: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (days: number) => {
    if (days === -1) return 'Unlimited';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;
    if (days === 30) return '1 month';
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} year${days >= 730 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">License Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Seasonal Suggestions */}
          {currentSeasonalTemplates.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                🎄 Seasonal Recommendations
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentSeasonalTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No templates found</p>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {template.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{formatDuration(template.duration)}</span>
                    </div>
                    
                    {template.creditsAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Credits:</span>
                        <span className="font-medium">{template.creditsAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Suggested Qty:</span>
                      <span className="font-medium">{template.suggestedQuantity}</span>
                    </div>
                    
                    {template.keyPrefix && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Key Prefix:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {template.keyPrefix}-XXXX
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Use Case:</strong> {template.useCase}
                    </p>
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

