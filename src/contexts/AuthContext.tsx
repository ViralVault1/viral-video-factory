import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
  const [credits, setCredits] = useState(100);

  const CREDIT_COSTS = {
    imageGeneration: 5,
    articleGeneration: 1
  };

  useEffect(() => {
    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name,
          credits: 100,
          createdAt: session.user.created_at
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name,
          credits: 100,
          createdAt: session.user.created_at
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name,
          credits: 100,
          createdAt: data.user.created_at
        });
        setCredits(100);
      }
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          credits: 100,
          createdAt: data.user.created_at
        });
        setCredits(100);
      }
      
      toast.success('Account created successfully! You received 100 free credits.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      if (user) {
        localStorage.removeItem(`userCredits_${user.id}`);
      }
      setUser(null);
      setCredits(0);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  const consumeCredits = async (action: 'imageGeneration' | 'articleGeneration') => {
    const cost = CREDIT_COSTS[action];
    
    if (credits < cost) {
      throw new Error(`Insufficient credits. You need ${cost} credits but have ${credits}. Contact support to add more credits.`);
    }

    const newBalance = credits - cost;
    setCredits(newBalance);
    
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
