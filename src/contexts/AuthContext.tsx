// contexts/AuthContext.tsx - Simplified version
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
  const [credits, setCredits] = useState(100); // Start with 100 credits

  // Credit costs configuration
  const CREDIT_COSTS = {
    imageGeneration: 5,
    articleGeneration: 1
  };

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Load credits from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCredits = localStorage.getItem(`userCredits_${user.id}`);
      if (savedCredits) {
        setCredits(parseInt(savedCredits));
      }
    }
  }, [user]);

  const initializeAuth = async () => {
    try {
      // Check if user is logged in (this depends on your existing auth system)
      const token = localStorage.getItem('authToken');
      if (token) {
        // For now, create a mock user - replace with your actual auth validation
        const mockUser: User = {
          id: 'user123',
          email: 'user@example.com',
          name: 'Demo User',
          credits: 100,
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Mock login - replace with your actual login logic
      const mockUser: User = {
        id: 'user123',
        email,
        name: 'Demo User',
        credits: 100,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
      setCredits(100);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // Mock signup - replace with your actual signup logic
      const mockUser: User = {
        id: 'user123',
        email,
        name: name || 'New User',
        credits: 100,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
      setCredits(100);
      toast.success('Account created successfully! You received 100 free credits.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    if (user) {
      localStorage.removeItem(`userCredits_${user.id}`);
    }
    setUser(null);
    setCredits(0);
    toast.success('Logged out successfully');
  };

  const consumeCredits = async (action: 'imageGeneration' | 'articleGeneration') => {
    const cost = CREDIT_COSTS[action];
    
    if (credits < cost) {
      throw new Error(`Insufficient credits. You need ${cost} credits but have ${credits}. Contact support to add more credits.`);
    }

    // Simple local credit consumption
    const newBalance = credits - cost;
    setCredits(newBalance);
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`userCredits_${user.id}`, String(newBalance));
      setUser(prev => prev ? { ...prev, credits: newBalance } : null);
    }

    toast.success(`Used ${cost} credits. ${newBalance} credits remaining.`);
  };

  const addCredits = async (amount: number) => {
    try {
      const newBalance = credits + amount;
      setCredits(newBalance);
      
      // Save to localStorage
      if (user) {
        localStorage.setItem(`userCredits_${user.id}`, String(newBalance));
        setUser(prev => prev ? { ...prev, credits: newBalance } : null);
      }

      toast.success(`Added ${amount} credits! New balance: ${newBalance}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add credits');
      throw error;
    }
  };

  const refreshCredits = async () => {
    // For localStorage-based system, just reload from storage
    if (user) {
      const savedCredits = localStorage.getItem(`userCredits_${user.id}`);
      if (savedCredits) {
        const creditAmount = parseInt(savedCredits);
        setCredits(creditAmount);
        setUser(prev => prev ? { ...prev, credits: creditAmount } : null);
      }
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
