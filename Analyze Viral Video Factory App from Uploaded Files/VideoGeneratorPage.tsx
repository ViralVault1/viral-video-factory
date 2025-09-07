import React from 'react';
import { GeneratorWorkflow } from './GeneratorWorkflow';

// FIX: The GeneratorWorkflow component requires an 'onNavigate' prop.
// This page component has been updated to accept 'onNavigate' as a prop and pass it down,
// which resolves the missing property error.
interface VideoGeneratorPageProps {
  onNavigate: (page: string) => void;
}

export const VideoGeneratorPage: React.FC<VideoGeneratorPageProps> = ({ onNavigate }) => {
  return (
    <div>
      <GeneratorWorkflow onNavigate={onNavigate} />
    </div>
  );
};
