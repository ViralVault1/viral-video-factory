// src/services/apiService.js
// Place this file in: src/services/apiService.js (frontend service layer)

import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Vercel automatically handles this
  : 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      toast.error(error.message || 'Request failed');
      throw error;
    }
  }

  // Video Generation
  async generateVideo(data) {
    return this.makeRequest('/generate-video', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Image Generation
  async generateImage(data) {
    return this.makeRequest('/generate-image', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Content Generation
  async generateContent(data) {
    return this.makeRequest('/generate-content', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Social Campaign Generation
  async generateSocialCampaign(data) {
    return this.makeRequest('/social-campaign', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Batch content generation
  async generateBatchContent(requests) {
    const promises = requests.map(request => {
      switch (request.type) {
        case 'video':
          return this.generateVideo(request.data);
        case 'image':
          return this.generateImage(request.data);
        case 'content':
          return this.generateContent(request.data);
        case 'campaign':
          return this.generateSocialCampaign(request.data);
        default:
          throw new Error(`Unknown request type: ${request.type}`);
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        id: requests[index].id || index,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      throw new Error(`Batch generation failed: ${error.message}`);
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Hook for React components
import { useState, useCallback } from 'react';

export const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiMethod, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService[apiMethod](...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    callApi,
    // Convenience methods
    generateVideo: useCallback((data) => callApi('generateVideo', data), [callApi]),
    generateImage: useCallback((data) => callApi('generateImage', data), [callApi]),
    generateContent: useCallback((data) => callApi('generateContent', data), [callApi]),
    generateSocialCampaign: useCallback((data) => callApi('generateSocialCampaign', data), [callApi]),
    generateBatchContent: useCallback((data) => callApi('generateBatchContent', data), [callApi])
  };
};
