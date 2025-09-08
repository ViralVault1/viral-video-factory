import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { aiAgentsRouter, createAgentRequest } from '../services/aiAgentsService';
import ContentStrategyAgent from '../services/contentStrategyAgent';
import ScriptOptimizationAgent from '../services/scriptOptimizationAgent';
import BrandConsistencyAgent from '../services/brandConsistencyAgent';
import PerformanceAnalyticsAgent from '../services/performanceAnalyticsAgent';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';

// Register all agents
const contentStrategyAgent = new ContentStrategyAgent();
const scriptOptimizationAgent = new ScriptOptimizationAgent();
const brandConsistencyAgent = new BrandConsistencyAgent();
const performanceAnalyticsAgent = new PerformanceAnalyticsAgent();

aiAgentsRouter.registerAgent('content-strategy', contentStrategyAgent);
aiAgentsRouter.registerAgent('script-optimization', scriptOptimizationAgent);
aiAgentsRouter.registerAgent('brand-consistency', brandConsistencyAgent);
aiAgentsRouter.registerAgent('performance-analytics', performanceAnalyticsAgent);

interface AIAgentsHubProps {
  onNavigate: (page: string) => void;
}

interface AgentCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  premium: boolean;
}

interface AgentResult {
  agentId: string;
  result: any;
  timestamp: string;
  confidence: number;
}

export const AIAgentsHub: React.FC<AIAgentsHubProps> = ({ onNavigate }) => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [agentInput, setAgentInput] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { user } = useAuth();
  const { showToast } = useNotification();

  const agentCards: AgentCard[] = [
    {
      id: 'content-strategy',
      name: 'Content Strategy AI',
      description: 'Advanced trend analysis, viral opportunity detection, and strategic content planning',
      icon: '🎯',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Real-time trend analysis',
        'Viral opportunity detection',
        'Competitor intelligence',
        'Hashtag optimization',
        'Posting schedule optimization'
      ],
      premium: true
    },
    {
      id: 'script-optimization',
      name: 'Script Optimization AI',
      description: 'Viral content research, script optimization, and A/B testing recommendations',
      icon: '✨',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Viral content research',
        'Script optimization',
        'Psychology trigger analysis',
        'A/B testing strategies',
        'Trend repurposing'
      ],
      premium: true
    },
    {
      id: 'brand-consistency',
      name: 'Brand Consistency AI',
      description: 'Brand voice analysis, multi-platform optimization, and N8N automation',
      icon: '🎨',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Brand voice analysis',
        'Cross-platform optimization',
        'N8N workflow automation',
        'Visual consistency',
        'Audience alignment'
      ],
      premium: true
    },
    {
      id: 'performance-analytics',
      name: 'Performance Analytics AI',
      description: 'Viral prediction, engagement forecasting, and advanced performance insights',
      icon: '📊',
      color: 'from-orange-500 to-red-500',
      features: [
        'Viral potential prediction',
        'Engagement forecasting',
        'Audience analysis',
        'Competitive benchmarking',
        'Real-time insights'
      ],
      premium: true
    }
  ];

  const agentActions = {
    'content-strategy': [
      { id: 'analyze-trends', name: 'Analyze Trends', description: 'Research trending topics and viral opportunities' },
      { id: 'generate-content-ideas', name: 'Generate Ideas', description: 'Create strategic content ideas' },
      { id: 'optimize-posting-schedule', name: 'Optimize Schedule', description: 'Find optimal posting times' },
      { id: 'create-hashtag-strategy', name: 'Hashtag Strategy', description: 'Create hashtag optimization plan' },
      { id: 'analyze-competitors', name: 'Competitor Analysis', description: 'Analyze competitor strategies' }
    ],
    'script-optimization': [
      { id: 'research-viral-content', name: 'Research Viral Content', description: 'Find and analyze trending content' },
      { id: 'optimize-script', name: 'Optimize Script', description: 'Enhance script for viral potential' },
      { id: 'repurpose-trending', name: 'Repurpose Trending', description: 'Adapt trending content for your niche' },
      { id: 'reverse-engineer-viral', name: 'Reverse Engineer', description: 'Extract viral mechanics from content' },
      { id: 'generate-ab-tests', name: 'A/B Test Ideas', description: 'Generate testing strategies' },
      { id: 'predict-viral-potential', name: 'Viral Prediction', description: 'Predict content viral potential' }
    ],
    'brand-consistency': [
      { id: 'analyze-brand-consistency', name: 'Brand Analysis', description: 'Analyze brand consistency across platforms' },
      { id: 'optimize-for-brand', name: 'Brand Optimization', description: 'Optimize content for brand alignment' },
      { id: 'validate-brand-alignment', name: 'Brand Validation', description: 'Validate brand alignment score' },
      { id: 'prepare-n8n-workflow', name: 'N8N Automation', description: 'Prepare automated posting workflow' },
      { id: 'cross-platform-optimization', name: 'Cross-Platform', description: 'Optimize for multiple platforms' }
    ],
    'performance-analytics': [
      { id: 'analyze-performance', name: 'Performance Analysis', description: 'Comprehensive performance insights' },
      { id: 'predict-viral-potential', name: 'Viral Prediction', description: 'Predict viral probability' },
      { id: 'forecast-engagement', name: 'Engagement Forecast', description: 'Forecast future engagement' },
      { id: 'analyze-audience', name: 'Audience Analysis', description: 'Deep audience insights' },
      { id: 'benchmark-performance', name: 'Competitive Benchmark', description: 'Compare against competitors' },
      { id: 'optimize-timing', name: 'Timing Optimization', description: 'Optimize posting timing' }
    ]
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' }
  ];

  const handleAgentAction = async () => {
    if (!activeAgent || !selectedAction || !agentInput.trim()) {
      showToast('Please select an agent, action, and provide input', 'error');
      return;
    }

    if (!user) {
      showToast('Please log in to use AI agents', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const request = createAgentRequest(
        activeAgent as any,
        selectedAction,
        {
          content: agentInput,
          platform: selectedPlatform,
          topic: agentInput,
          niche: user.profile?.niche || 'general',
          goals: ['engagement', 'growth']
        },
        user.id
      );

      const response = await aiAgentsRouter.processRequest(request);

      if (response.success) {
        const newResult: AgentResult = {
          agentId: activeAgent,
          result: response.data,
          timestamp: new Date().toISOString(),
          confidence: response.confidence
        };

        setResults(prev => [newResult, ...prev.slice(0, 4)]); // Keep last 5 results
        showToast(`${agentCards.find(a => a.id === activeAgent)?.name} completed successfully!`, 'success');
        setAgentInput('');
      } else {
        showToast('Agent processing failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Agent error:', error);
      showToast('An error occurred while processing your request.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatResult = (result: any, agentId: string) => {
    if (typeof result === 'string') {
      return result;
    }

    // Format different agent results
    switch (agentId) {
      case 'content-strategy':
        if (result.trendingTopics) {
          return `Found ${result.trendingTopics.length} trending topics with ${result.viralOpportunities?.length || 0} viral opportunities. Confidence: ${result.confidenceScore || 0}%`;
        }
        break;
      case 'script-optimization':
        if (result.optimization) {
          return result.optimization.slice(0, 200) + '...';
        }
        break;
      case 'brand-consistency':
        if (result.overallScore) {
          return `Brand consistency score: ${result.overallScore}%. ${result.improvementRecommendations?.length || 0} recommendations provided.`;
        }
        break;
      case 'performance-analytics':
        if (result.viralPrediction) {
          return `Viral probability: ${result.viralPrediction.viralProbability}%. Confidence: ${result.viralPrediction.confidenceLevel}%`;
        }
        break;
    }

    return JSON.stringify(result).slice(0, 200) + '...';
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            AI Agents Hub
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-400">
            Advanced AI agents that research trends, optimize content, ensure brand consistency, 
            and predict viral potential with cutting-edge analytics.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Premium AI Models</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <span className="text-sm font-medium">Multi-LLM Powered</span>
            </div>
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {agentCards.map((agent) => (
            <div
              key={agent.id}
              className={`relative bg-gray-800 rounded-2xl p-6 border border-gray-700 cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeAgent === agent.id ? 'ring-2 ring-purple-500 bg-gray-700' : 'hover:border-gray-600'
              }`}
              onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
            >
              {agent.premium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${agent.color} flex items-center justify-center text-2xl mb-4`}>
                {agent.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
              
              <div className="space-y-1">
                {agent.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span>{feature}</span>
                  </div>
                ))}
                {agent.features.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{agent.features.length - 3} more features
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Agent Interface */}
        {activeAgent && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {agentCards.find(a => a.id === activeAgent)?.name}
              </h2>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Action Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Action
                  </label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Choose an action...</option>
                    {agentActions[activeAgent as keyof typeof agentActions]?.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.name} - {action.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Platform
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedPlatform === platform.id
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-lg mb-1">{platform.icon}</div>
                        <div className="text-xs">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content / Topic / Script
                  </label>
                  <textarea
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    placeholder="Enter your content, topic, or script for AI analysis..."
                    rows={6}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <h4 className="text-sm font-medium text-gray-300">Advanced Options</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Analysis Depth</label>
                        <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                          <option>Standard</option>
                          <option>Deep Analysis</option>
                          <option>Maximum Depth</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Confidence Threshold</label>
                        <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                          <option>80%</option>
                          <option>85%</option>
                          <option>90%</option>
                          <option>95%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleAgentAction}
                  disabled={isProcessing || !selectedAction || !agentInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon className="w-5 h-5" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Run AI Agent</span>
                    </>
                  )}
                </button>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Recent Results</h3>
                
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-lg">No results yet</p>
                    <p className="text-sm">Run an AI agent to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {agentCards.find(a => a.id === result.agentId)?.icon}
                            </span>
                            <span className="text-sm font-medium text-white">
                              {agentCards.find(a => a.id === result.agentId)?.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs ${
                              result.confidence >= 90 ? 'bg-green-500/20 text-green-300' :
                              result.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {result.confidence}% confidence
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">
                          {formatResult(result.result, result.agentId)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why Our AI Agents Are Game-Changing
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Multi-LLM Powered</h3>
              <p className="text-sm text-gray-400">
                Uses Gemini Pro, GPT-4, and Claude for optimal results
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-sm text-gray-400">
                Live trend analysis and viral opportunity detection
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-white mb-2">90%+ Accuracy</h3>
              <p className="text-sm text-gray-400">
                Viral predictions with industry-leading accuracy
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-white mb-2">N8N Integration</h3>
              <p className="text-sm text-gray-400">
                Automated workflows for multi-platform posting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

