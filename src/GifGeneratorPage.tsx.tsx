import React from 'react';

interface GifGeneratorPageProps {
  onNavigate: (page: string) => void;
  initialFile?: File | null;
  onFileConsumed?: () => void;
}

export function GifGeneratorPage({ onNavigate, initialFile, onFileConsumed }: GifGeneratorPageProps) {
  return (
    <div>
      <h2>Gif Generator Page</h2>
      {/* TODO: Add your gif generator logic or UI elements here */}
      <p>This is a placeholder for the Gif Generator Page component.</p>
    </div>
  );
}
