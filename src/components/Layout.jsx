import React from 'react';
import { cn } from '../lib/utils';

export const Layout = ({ children, className, rightHeader }) => {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      'flex flex-col',
      className
    )}>
      <header className="bg-card border-b border-border backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Deafine
              </h1>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Realtime speaker-aware transcripts</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {rightHeader}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {children}
      </main>

      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <p className="text-xs sm:text-sm text-center text-muted-foreground">
            Breaking barriers in communication
          </p>
        </div>
      </footer>
    </div>
  );
};