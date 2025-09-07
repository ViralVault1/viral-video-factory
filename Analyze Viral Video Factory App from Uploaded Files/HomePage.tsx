

import React from 'react';
import { Hero } from './Hero';
import { Showcase } from './Showcase';
import { FAQ } from './FAQ';
import { GeneratorWorkflow } from './GeneratorWorkflow';
import { HowItWorks } from './HowItWorks';
import { CreationsGallery } from './CreationsGallery';
import { VideoShowcase } from './VideoShowcase';

interface HomePageProps {
  initialScript?: string | null;
  onNavigate: (page: string, payload?: { script?: string; imageUrl?: string; file?: File }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ initialScript, onNavigate }) => {
  const handleHeroCTAClick = () => {
    const generatorSection = document.getElementById('generator-workflow');
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Hero onCTAClick={handleHeroCTAClick} />
      <HowItWorks />
      <GeneratorWorkflow initialScript={initialScript} onNavigate={onNavigate} />
      <CreationsGallery onNavigate={onNavigate} />
      <VideoShowcase onNavigate={onNavigate} />
      <Showcase />
      <FAQ />
    </>
  );
};
