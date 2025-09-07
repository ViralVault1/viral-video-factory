import React, { createContext, useContext } from 'react';
const BrandContext = createContext();
export const useBrand = () => useContext(BrandContext);
export const BrandProvider = ({ children }) => (
  <BrandContext.Provider value={{}}>{children}</BrandContext.Provider>
);
