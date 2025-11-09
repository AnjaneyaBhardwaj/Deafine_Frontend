import React from 'react';
import { cn } from '../lib/utils';

export const Layout = ({ children, className, rightHeader }) => {
  return (
    <div className={cn(
      'min-h-screen bg-gray-50 dark:bg-gray-900',
      'flex flex-col',
      className
    )}>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Deafine
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">Realtime speaker-aware transcripts</span>
            </div>
            <div className="flex items-center gap-3">
              {rightHeader}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Breaking barriers in communication
          </p>
        </div>
      </footer>
    </div>
  );
};