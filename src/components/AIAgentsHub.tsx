import React, { useState } from 'react';

interface AIAgentsHubProps {
  onNavigate: (page: string) => void;
}

export const AIAgentsHub: React.FC<AIAgentsHubProps> = ({ onNavigate }) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      id: 'content-strategy',
      name: 'Content Strategy Agent',
      description: 'Analyzes trends and suggests viral content strategies',
      status: 'active',
      color: 'bg-green-600'
    },
    {
      id: 'brand-consistency',
      name: 'Brand Consistency Agent',
      description: 'Ensures all content aligns with your brand voice',
      status: 'active',
      color: 'bg-blue-600'
    },
    {
      id: 'script-optimization',
      name: 'Script Optimization Agent',
      description: 'Optimizes scripts for maximum engagement',
      status: 'active',
      color: 'bg-purple-600'
    },
    {
      id: 'performance-analytics',
      name: 'Performance Analytics Agent',
      description: 'Tracks and analyzes video performance metrics',
      status: 'active',
      color: 'bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">AI Agents Hub</h1>
          <p className="text-gray-400">Manage your AI-powered content creation assistants</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium">Active</span>
                <button 
                  onClick={() => setSelectedAgent(agent.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Agent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Content Strategy Agent</p>
                  <p className="text-gray-400 text-sm">Analyzed 5 trending topics</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">2 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
