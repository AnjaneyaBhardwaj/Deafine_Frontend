import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

const speakerColors = {
  S1: { bg: 'bg-primary', light: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },
  S2: { bg: 'bg-secondary', light: 'bg-secondary/10', border: 'border-secondary/20', text: 'text-secondary' },
  S3: { bg: 'bg-accent', light: 'bg-accent/30', border: 'border-accent/30', text: 'text-accent-foreground' },
  S4: { bg: 'bg-primary', light: 'bg-primary/5', border: 'border-primary/10', text: 'text-primary' },
  S5: { bg: 'bg-secondary', light: 'bg-secondary/5', border: 'border-secondary/10', text: 'text-secondary' },
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
    bg: 'bg-muted', 
    light: 'bg-muted', 
    border: 'border-border',
    text: 'text-muted-foreground'
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
        isActive && `ring-${colors.text.replace('text-', '')}`
      )}>
        {speaker}
      </div>
      <div className={cn(
        "flex-1 transform transition-all duration-300 min-w-0",
        showAnimation && "animate-fade-in"
      )}>
        <div className={cn(
          'rounded-2xl py-2 px-3 sm:py-3 sm:px-4 inline-block max-w-full shadow-card',
          'transition-all duration-300',
          isActive ? cn(colors.light, colors.border, 'border-2') : 'bg-card border border-border',
          showAnimation && 'animate-bubble-pop'
        )}>
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <p className={cn(
              "text-foreground text-sm sm:text-base leading-relaxed break-words",
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