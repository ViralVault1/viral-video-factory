import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  email?: string;
  credits?: number;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscription: any;
  error: string | null;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Demo user for development
    setUser({ id: '1', email: 'demo@example.com', credits: 100 });
    setLoading(false);
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isPremium: false,
      subscription: null,
      error,
      signInWithPassword,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
