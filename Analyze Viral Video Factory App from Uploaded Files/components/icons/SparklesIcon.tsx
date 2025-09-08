import React from 'react';

interface IconProps {
  className?: string;
}

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.057-3L11 3l3.057 3L17 3v4l-3.057 3L11 10l-3.057-3L5 10V3z" />
  </svg>
);
