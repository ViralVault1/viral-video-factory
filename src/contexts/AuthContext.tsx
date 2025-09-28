// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  credits: number;
  consumeCredits: (action: 'imageGeneration' | 'articleGeneration') => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  // Credit costs configuration
  const CREDIT_COSTS = {
    imageGeneration: 5,
    articleGeneration: 1
  };

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await validateToken(token);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setCredits(userData.credits);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setCredits(data.user.credits);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setCredits(data.user.credits);
      toast.success('Account created successfully! You received 100 free credits.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCredits(0);
    toast.success('Logged out successfully');
  };

  const consumeCredits = async (action: 'imageGeneration' | 'articleGeneration') => {
    const cost = CREDIT_COSTS[action];
    
    if (credits < cost) {
      throw new Error(`Insufficient credits. You need ${cost} credits but have ${credits}. Please purchase more credits to continue.`);
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, cost })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to consume credits');
      }

      setCredits(data.newBalance);
      
      if (user) {
        setUser(prev => prev ? { ...prev, credits: data.newBalance } : null);
      }

      toast.success(`Used ${cost} credits. ${data.newBalance} credits remaining.`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to consume credits');
      throw error;
    }
  };

  const addCredits = async (amount: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/credits/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add credits');
      }

      setCredits(data.newBalance);
      
      if (user) {
        setUser(prev => prev ? { ...prev, credits: data.newBalance } : null);
      }

      toast.success(`Added ${amount} credits! New balance: ${data.newBalance}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add credits');
      throw error;
    }
  };

  const refreshCredits = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/credits/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCredits(data.credits);
        if (user) {
          setUser(prev => prev ? { ...prev, credits: data.credits } : null);
        }
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    signup,
    credits,
    consumeCredits,
    addCredits,
    refreshCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
