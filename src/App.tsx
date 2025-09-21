import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import VideoGeneratorPage from './pages/VideoGeneratorPage';
import AIInfluencerStudioPage from './pages/AIInfluencerStudioPage';
import SocialMediaSuitePage from './pages/SocialMediaSuitePage';
import SocialStudioPage from './pages/SocialStudioPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import ImageRemixStudioPage from './pages/ImageRemixStudioPage';
import GifGeneratorPage from './pages/GifGeneratorPage';
import ProductAdStudioPage from './pages/ProductAdStudioPage';
import ProductHuntPage from './pages/ProductHuntPage';
import PricingPage from './pages/PricingPage';
import LicenseRedemptionPage from './pages/LicenseRedemptionPage';
import RedeemLicensePage from './pages/RedeemLicensePage';
import VideoToGifPage from './pages/VideoToGifPage';
import AuthPage from './pages/AuthPage';
import AutoWriterPage from './pages/AutoWriterPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrandProvider } from './contexts/BrandContext';

// Types
import { User } from './types';

// Main app layout component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Main App component
const App: React.FC = () => {
  useEffect(() => {
    console.log('Viral Video Factory initialized');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrandProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/auto-writer" element={
                    <ProtectedRoute>
                      <AutoWriterPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/social-media-suite" element={
                    <ProtectedRoute>
                      <SocialMediaSuitePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/social-studio" element={
                    <ProtectedRoute>
                      <SocialStudioPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ai-influencer" element={
                    <ProtectedRoute>
                      <AIInfluencerStudioPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/video-generator" element={
                    <ProtectedRoute>
                      <VideoGeneratorPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/product-ad-studio" element={
                    <ProtectedRoute>
                      <ProductAdStudioPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/image-generator" element={
                    <ProtectedRoute>
                      <ImageGeneratorPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/image-remix-studio" element={
                    <ProtectedRoute>
                      <ImageRemixStudioPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/video-to-gif" element={
                    <ProtectedRoute>
                      <VideoToGifPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/gif-generator" element={
                    <ProtectedRoute>
                      <GifGeneratorPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ai-pricing" element={
                    <ProtectedRoute>
                      <PricingPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/redeem-license" element={
                    <ProtectedRoute>
                      <RedeemLicensePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/license-redemption" element={
                    <ProtectedRoute>
                      <LicenseRedemptionPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/product-hunt" element={
                    <ProtectedRoute>
                      <ProductHuntPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect any unknown routes to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      border: '1px solid #374151',
                    },
                    success: {
                      style: {
                        background: '#065f46',
                        border: '1px solid #10b981',
                      },
                    },
                    error: {
                      style: {
                        background: '#7f1d1d',
                        border: '1px solid #ef4444',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </AuthProvider>
        </BrandProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
