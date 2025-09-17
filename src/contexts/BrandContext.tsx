import React, { createContext, useContext, useState } from 'react';
import { BrandKit } from '../types';

interface BrandContextType {
  brandKit: BrandKit;
  setBrandKit: (brandKit: BrandKit) => void;
  updateBrandKit: (updates: Partial<BrandKit>) => void;
}

const defaultBrandKit: BrandKit = {
  logoUrl: null,
  primaryColor: '#22c55e',
  secondaryColor: '#9333ea',
  font: 'font-sans',
  n8nWebhookUrl: null
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandKit, setBrandKit] = useState<BrandKit>(defaultBrandKit);

  const updateBrandKit = (updates: Partial<BrandKit>) => {
    setBrandKit(prev => ({ ...prev, ...updates }));
  };

  const value = {
    brandKit,
    setBrandKit,
    updateBrandKit
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

