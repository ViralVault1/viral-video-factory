import React from 'react';

interface OAuthCallbackPageProps {
  onNavigate: (page: string) => void;
}

export const OAuthCallbackPage: React.FC<OAuthCallbackPageProps> = ({ onNavigate }) => {
  React.useEffect(() => {
    setTimeout(() => {
      onNavigate('home');
    }, 2000);
  }, [onNavigate]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Connecting Account...</h1>
        <p className="text-gray-400">Please wait while we complete the connection.</p>
      </div>
    </div>
  );
};
