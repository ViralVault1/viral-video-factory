import React, { createContext, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);
