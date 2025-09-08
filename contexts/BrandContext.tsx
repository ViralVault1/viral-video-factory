import React, { createContext, useContext, useState } from 'react';

interface BrandKit {
  name: string;
  voice: string;
  tone: string;
  values: string[];
  colors: {
    primary: string;
    secondary: string;
  };
  targetAudience: string;
  n8nWebhookUrl?: string;
}

interface BrandContextType {
  brandKit: BrandKit | null;
  setBrandKit: (kit: BrandKit) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);

  return (
    <BrandContext.Provider value={{ brandKit, setBrandKit }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
