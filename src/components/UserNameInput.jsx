import React from 'react';

export const UserNameInput = ({ value, onChange, onTest, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="userName" className="text-sm font-medium">
        Your Name (for notifications)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id="userName"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your name"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {onTest && (
          <button
            onClick={onTest}
            className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
            title="Test notification"
          >
            Test
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        You'll receive notifications when your name is mentioned in conversations
      </p>
    </div>
  );
};