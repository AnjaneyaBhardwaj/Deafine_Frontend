import React from 'react';
import { cn } from '../lib/utils';

export const ControlPanel = ({
  onSubmit,
  onFileChange,
  onStartRecording,
  onStopRecording,
  isRecording,
  isLoading,
  className
}) => {
  return (
    <div className={cn(
      'bg-card rounded-xl shadow-card',
      'border border-border',
      'p-4 sm:p-5',
      className
    )}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-3 gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Controls</h3>
          <p className="text-xs text-muted-foreground hidden sm:block">Use the microphone to capture a live transcript in realtime.</p>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Live
          </div>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={onStartRecording}
            className={cn(
              'flex items-center justify-center gap-2 px-4 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-medium w-full sm:w-auto',
              'bg-primary text-primary-foreground shadow-card',
              'hover:bg-primary/90',
              'transition-all duration-200'
            )}
          >
            <span className="text-base sm:text-lg">🔴</span>
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={onStopRecording}
            className={cn(
              'flex items-center justify-center gap-2 px-4 sm:px-4 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-medium w-full sm:w-auto',
              'bg-destructive text-destructive-foreground shadow-card',
              'hover:bg-destructive/90',
              'transition-all duration-200'
            )}
          >
            <span className="text-base sm:text-lg">⏹️</span>
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};