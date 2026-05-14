import React from 'react';

interface AdPlaceholderProps {
  format: 'leaderboard' | 'rectangle' | 'responsive' | 'banner';
  className?: string;
}

export function AdPlaceholder({ format, className = '' }: AdPlaceholderProps) {
  const formatStyles = {
    leaderboard: 'w-full max-w-[728px] h-[90px]',
    rectangle: 'w-[300px] h-[250px]',
    responsive: 'w-full min-h-[100px]',
    banner: 'w-full max-w-[468px] h-[60px]',
  };

  return (
    <div className={`bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-sm overflow-hidden my-4 ${formatStyles[format]} ${className}`}>
      <span className="font-semibold px-2 text-center text-gray-500">AdSense {format} Placeholder</span>
      {format === 'leaderboard' && <span className="text-xs mt-1">728x90</span>}
      {format === 'rectangle' && <span className="text-xs mt-1">300x250</span>}
      {format === 'banner' && <span className="text-xs mt-1">468x60</span>}
    </div>
  );
}
