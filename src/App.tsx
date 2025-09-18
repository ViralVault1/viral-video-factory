effect OK import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { VideoGeneratorPage } from './pages/VideoGeneratorPage';
import { AIInfluencerStudioPage } from './pages/AIInfluencerStudioPage';
import { SocialMediaSuitePage } from './pages/SocialMediaSuitePage';
import { SocialStudioPage } from './pages/SocialStudioPage';
import { ImageGeneratorPage } from './pages/ImageGeneratorPage';
import { ImageRemixStudioPage } from './pages/ImageRemixStudioPage';
import { GifGeneratorPage } from './pages/GifGeneratorPage';
import { ProductAdStudioPage } from './pages/ProductAdStudioPage';
import { ProductHuntPage } from './pages/ProductHuntPage';
import { PricingPage } from './pages/PricingPage';
import { LicenseRedemptionPage } from './pages/LicenseRedemptionPage';
import { RedeemLicensePage } from './pages/RedeemLicensePage';
import { VideoToGifPage } from './pages/VideoToGifPage';
import { AuthPage } from './pages/AuthPage';
import AutoWriterPage from './pages/AutoWriterPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

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
    return (
      <div className="min-h-screen bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
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

  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
useEffect(() => {
  console.log('Viral Video Factory initialized');
  
  // Test API connections
  const testConnections = async () => {
    console.log('🧪 Testing API connections...');
    
    try {
      // Test Supabase
      const { supabase } = await import('./config/supabase');
      const { data, error } = await supabase.auth.getSession();
      console.log('✅ Supabase connected:', !error);
    } catch (err) {
      console.error('❌ Supabase error:', err);
    }

    try {
      // Test Stripe
      const stripePromise = await import('./config/stripe');
      const stripe = await stripePromise.default;
      console.log('✅ Stripe loaded:', !!stripe);
    } catch (err) {
      console.error('❌ Stripe error:', err);
    }

    try {
      // Test Gemini
      const { model } = await import('./config/gemini');
      const result = await model.generateContent("Hello");
      console.log('✅ Gemini connected:', !!result);
    } catch (err) {
      console.error('❌ Gemini error:', err);
    }
  };

  testConnections();
}, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BrandProvider>
            <ErrorBoundary>
              <div className="App">
                <Routes>
                  {/* Public routes */}
                  <Route 
                    path="/auth" 
                    element={
                      <AppLayout>
                        <AuthPage />
                      </AppLayout>
                    } 
                  />
                  
                  <Route 
                    path="/pricing" 
                    element={
                      <AppLayout>
                        <PricingPage />
                      </AppLayout>
                    } 
                  />

                  {/* Protected routes */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <HomePage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/video-generator" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <VideoGeneratorPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/auto-writer" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <AutoWriterPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/ai-influencer-studio" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <AIInfluencerStudioPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/social-media-suite" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <SocialMediaSuitePage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/social-studio" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <SocialStudioPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/image-generator" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ImageGeneratorPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/image-remix-studio" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ImageRemixStudioPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/gif-generator" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <VideoToGifPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/product-ad-studio" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ProductAdStudioPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/product-hunt" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ProductHuntPage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/redeem-license" 
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <RedeemLicensePage />
                        </AppLayout>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Global toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#374151',
                      color: '#ffffff',
                      border: '1px solid #4b5563',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </div>
            </ErrorBoundary>
          </BrandProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
