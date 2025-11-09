import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

const speakerColors = {
  S1: { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200' },
  S2: { bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200' },
  S3: { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200' },
  S4: { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200' },
  S5: { bg: 'bg-pink-500', light: 'bg-pink-50', border: 'border-pink-200' },
};

export const TranscriptBubble = ({ 
  speaker, 
  text, 
  isActive, 
  isLatest, 
  className 
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const colors = speakerColors[speaker] || { 
    bg: 'bg-gray-500', 
    light: 'bg-gray-50', 
    border: 'border-gray-200' 
  };

  useEffect(() => {
    if (isLatest) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLatest]);
  
  return (
    <div className={cn(
      'flex gap-2 sm:gap-3 mb-3 sm:mb-4 items-start transition-all duration-300',
      isActive && 'scale-[1.02] z-10',
      className
    )}>
      <div className={cn(
        'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm',
        'transition-transform duration-300 flex-shrink-0',
        colors.bg,
        isActive && 'scale-110 ring-2 ring-offset-2 ring-opacity-50',
        isActive && colors.border.replace('border', 'ring')
      )}>
        {speaker}
      </div>
      <div className={cn(
        "flex-1 transform transition-all duration-300 min-w-0",
        showAnimation && "animate-fade-in"
      )}>
        <div className={cn(
          'rounded-2xl py-2 px-3 sm:py-3 sm:px-4 inline-block max-w-full shadow-md',
          'transition-all duration-300',
          isActive ? cn(colors.light, colors.border, 'border-2') : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
          showAnimation && 'animate-bubble-pop'
        )}>
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <p className={cn(
              "text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-relaxed break-words",
              isActive && 'font-medium'
            )}>
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};