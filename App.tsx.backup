

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ImageGeneratorPage } from './components/ImageGeneratorPage';
import { GifGeneratorPage } from './components/GifGeneratorPage';
import { PricingPage } from './components/PricingPage';
import { ProductHuntPage } from './components/ProductHuntPage';
import { ProductAdStudioPage } from './components/ProductAdStudioPage';
import { NotificationProvider } from './components/NotificationProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { LicenseGeneratorPage } from './components/LicenseGeneratorPage';
import { LicenseRedemptionPage } from './components/LicenseRedemptionPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrandProvider } from './contexts/BrandContext';
import { isGeminiConfigured } from './lib/apiKeys';
import { isSupabaseCredentialsPlaceholder } from './lib/supabaseClient';
import { UserGuidePage } from './components/UserGuidePage';
import { ApiDocsPage } from './components/ApiDocsPage';
import { Sidebar } from './components/Sidebar';
import { SocialMediaSuitePage } from './components/SocialMediaSuitePage';
import { OAuthCallbackPage } from './components/OAuthCallbackPage';
import { AIInfluencerStudioPage } from './components/AIInfluencerStudioPage';
import { LoaderIcon } from './components/icons/LoaderIcon';
import { ImageRemixStudioPage } from './components/ImageRemixStudioPage';
import { SocialStudioPage } from './components/SocialStudioPage';
import { WelcomeModal } from './components/WelcomeModal';
import { AIAgentsHub } from './components/AIAgentsHub';
import { ErrorBoundary } from './components/ErrorBoundary';


const AppContent: React.FC = () => {
    const { user, error, loading } = useAuth();
    
    const [currentPage, setCurrentPage] = useState('home');
    const [initialScript, setInitialScript] = useState<string | null>(null);
    const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
    const [initialFile, setInitialFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        // Show welcome modal for new, non-guest users
        if (user && !user.isGuest) {
            const welcomeSeen = localStorage.getItem('welcomeModalSeen');
            if (!welcomeSeen) {
                setShowWelcomeModal(true);
                localStorage.setItem('welcomeModalSeen', 'true');
            }
        }
    }, [user]);

    if (loading) {
        return (
            <div className="bg-gray-800 min-h-screen flex items-center justify-center">
                <LoaderIcon className="w-12 h-12 text-green-400" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4">
                <div className="max-w-4xl w-full text-left">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Application Setup Error</h1>
                    <p className="text-lg text-gray-400 mb-6">
                        A critical error occurred while initializing your application's backend. This often means a required database table or function is missing.
                    </p>
                    <div className="text-left bg-gray-900 p-4 rounded-md font-mono text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">
                        {error}
                    </div>
                    <p className="text-gray-500 mt-6 text-sm">Please follow the instructions in the error message above by running the provided SQL script in your Supabase project's SQL Editor. The application will not function correctly until this is resolved.</p>
                </div>
            </div>
        );
    }
    
    const handleNavigate = (page: string, payload?: { script?: string; imageUrl?: string; file?: File }) => {
        setCurrentPage(page);
        setInitialScript(payload?.script ?? null);
        setInitialImageUrl(payload?.imageUrl ?? null);
        setInitialFile(payload?.file ?? null);
        window.scrollTo(0, 0);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };
    
    const renderPage = () => {
        if (window.location.pathname === '/oauth-callback') {
          return <OAuthCallbackPage onNavigate={handleNavigate} />;
        }
    
        switch (currentPage) {
          case 'home':
            return <HomePage initialScript={initialScript} onNavigate={handleNavigate} />;
          case 'image-generator':
            return <ImageGeneratorPage onNavigate={handleNavigate} />;
          case 'image-remix-studio':
            return <ImageRemixStudioPage onNavigate={handleNavigate} />;
          case 'gif-generator':
            return <GifGeneratorPage onNavigate={handleNavigate} initialFile={initialFile} onFileConsumed={() => setInitialFile(null)} />;
          case 'pricing':
            return <PricingPage onNavigate={handleNavigate} />;
          case 'social-media-suite':
              return <SocialMediaSuitePage onNavigate={handleNavigate} />;
          case 'social-studio':
              return <SocialStudioPage onNavigate={handleNavigate} />;
          case 'ai-influencer-studio':
              return <AIInfluencerStudioPage onNavigate={handleNavigate} />;
          case 'ai-agents':
              return <AIAgentsHub onNavigate={handleNavigate} />;
          case 'product-hunt':
              return <ProductHuntPage onNavigate={handleNavigate} />;
          case 'product-ad-studio':
              return <ProductAdStudioPage onNavigate={handleNavigate} initialImageUrl={initialImageUrl} />;
          case 'auth':
              return <AuthPage onNavigate={handleNavigate} />;
          case 'license-generator':
              return <LicenseGeneratorPage onNavigate={handleNavigate} />;
          case 'redeem-license':
              return <LicenseRedemptionPage onNavigate={handleNavigate} />;
          case 'user-guide':
              return <UserGuidePage onNavigate={handleNavigate} />;
          case 'api-docs':
              return <ApiDocsPage onNavigate={handleNavigate} />;
          default:
            return <HomePage initialScript={initialScript} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-gray-800 text-white min-h-screen">
            <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
            <Sidebar
                onNavigate={handleNavigate}
                currentPage={currentPage}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header
                    onNavigate={handleNavigate}
                    onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer onNavigate={handleNavigate} />
            </div>
        </div>
    );
};


const App: React.FC = () => {
  if (!isGeminiConfigured) {
    return (
        <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Configuration Error</h1>
                <p className="text-lg text-gray-400 mb-6">
                    The required Gemini API Key is not configured in your project's environment.
                </p>
                <div className="text-left bg-gray-900 p-4 rounded-md font-mono text-sm text-gray-400">
                    <p>1. Go to Google AI Studio to get your API key.</p>
                    <p>2. Set it as the <code className="bg-gray-700 text-white font-semibold px-1.5 py-0.5 rounded">API_KEY</code> secret or environment variable in your deployment settings.</p>
                </div>
                <p className="text-gray-500 mt-6 text-sm">The application will not function until this is configured.</p>
            </div>
        </div>
    );
  }

  if (isSupabaseCredentialsPlaceholder) {
    return (
        <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Supabase Configuration Required</h1>
                <p className="text-lg text-gray-400 mb-6">
                    Your application cannot connect to the database because it is using placeholder credentials. You must provide your own Supabase project's keys as environment variables.
                </p>
                <div className="text-left bg-gray-900 p-4 rounded-md font-mono text-sm text-gray-400 space-y-2">
                    <p className="font-bold text-white">Action Required:</p>
                    <p>Set the following environment variables or secrets in your project's deployment settings:</p>
                    <p>1. Go to your Supabase project dashboard and navigate to <span className="font-semibold text-white">Project Settings &gt; API</span>.</p>
                    <p>2. Set <code className="bg-gray-700 text-white font-semibold px-1.5 py-0.5 rounded">SUPABASE_URL</code> to your Project URL.</p>
                    <p>3. Set <code className="bg-gray-700 text-white font-semibold px-1.5 py-0.5 rounded">SUPABASE_ANON_KEY</code> to your `anon` public key.</p>
                </div>
                <p className="text-gray-500 mt-6 text-sm">The application will not function until this is resolved. The login page will appear once the credentials are correct.</p>
            </div>
        </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
          <BrandProvider>
              <NotificationProvider>
                  <AuthProvider>
                      <AppContent />
                  </AuthProvider>
              </NotificationProvider>
          </BrandProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;