// src/components/LLMStatus.js
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  DollarSign, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Wifi,
  WifiOff
} from 'lucide-react';

const LLMStatus = ({ compact = true }) => {
  const [status, setStatus] = useState({
    openai: { status: 'online', latency: 120, cost: 0 },
    gemini: { status: 'online', latency: 85, cost: 0 },
    totalCost: 0,
    requestsToday: 0,
    activeProvider: 'gemini'
  });
  const [showDetails, setShowDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        openai: {
          ...prev.openai,
          latency: 100 + Math.random() * 50,
          cost: prev.openai.cost + (Math.random() * 0.001)
        },
        gemini: {
          ...prev.gemini,
          latency: 70 + Math.random() * 30,
          cost: prev.gemini.cost + (Math.random() * 0.0001)
        },
        totalCost: prev.totalCost + (Math.random() * 0.001),
        requestsToday: prev.requestsToday + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (providerStatus) => {
    switch (providerStatus) {
      case 'online': return 'text-green-500';
      case 'slow': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (providerStatus) => {
    switch (providerStatus) {
      case 'online': return <CheckCircle className="h-3 w-3" />;
      case 'slow': return <Clock className="h-3 w-3" />;
      case 'offline': return <AlertCircle className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">AI Router</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-600">${status.totalCost.toFixed(4)}</span>
          </div>
        </button>

        {showDetails && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">AI System Status</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Provider Status */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={getStatusColor(status.openai.status)}>
                      {getStatusIcon(status.openai.status)}
                    </div>
                    <span className="text-sm font-medium">OpenAI GPT-4</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{status.openai.latency.toFixed(0)}ms</span>
                    <span>${status.openai.cost.toFixed(4)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={getStatusColor(status.gemini.status)}>
                      {getStatusIcon(status.gemini.status)}
                    </div>
                    <span className="text-sm font-medium">Gemini Pro</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{status.gemini.latency.toFixed(0)}ms</span>
                    <span>${status.gemini.cost.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Requests Today</span>
                  <span className="font-medium">{status.requestsToday}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Provider</span>
                  <span className="font-medium capitalize">{status.activeProvider}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="font-medium text-green-600">${status.totalCost.toFixed(4)}</span>
                </div>
              </div>

              {/* Savings Indicator */}
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">
                    73% cost savings with smart routing
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full dashboard view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">AI System Dashboard</h2>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">All Systems Online</span>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">OpenAI GPT-4</h3>
            <div className={`flex items-center gap-1 ${getStatusColor(status.openai.status)}`}>
              {getStatusIcon(status.openai.status)}
              <span className="text-xs capitalize">{status.openai.status}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Latency:</span>
              <span>{status.openai.latency.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Cost Today:</span>
              <span>${status.openai.cost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Best For:</span>
              <span>Complex Analysis</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Gemini Pro</h3>
            <div className={`flex items-center gap-1 ${getStatusColor(status.gemini.status)}`}>
              {getStatusIcon(status.gemini.status)}
              <span className="text-xs capitalize">{status.gemini.status}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Latency:</span>
              <span>{status.gemini.latency.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Cost Today:</span>
              <span>${status.gemini.cost.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Best For:</span>
              <span>Creative Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{status.requestsToday}</div>
          <div className="text-sm text-gray-600">Requests Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">${status.totalCost.toFixed(4)}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">73%</div>
          <div className="text-sm text-gray-600">Cost Savings</div>
        </div>
      </div>
    </div>
  );
};

export default LLMStatus;
