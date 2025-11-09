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
      'bg-white dark:bg-gray-800 rounded-xl shadow-md',
      'border border-gray-100 dark:border-gray-700',
      'p-5',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Controls</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Use the microphone to capture a live transcript in realtime.</p>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Live
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={onStartRecording}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow',
              'hover:from-green-600 hover:to-emerald-600',
              'transition-all duration-200'
            )}
          >
            <span className="text-lg">🔴</span>
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={onStopRecording}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow',
              'hover:from-red-600 hover:to-rose-600',
              'transition-all duration-200'
            )}
          >
            <span className="text-lg">⏹️</span>
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};