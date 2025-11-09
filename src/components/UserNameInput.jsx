import React from 'react';

export const UserNameInput = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="userName" className="text-sm font-medium">
        Your Name (for notifications)
      </label>
      <input
        type="text"
        id="userName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="text-xs text-muted-foreground">
        You'll receive notifications when your name is mentioned in conversations
      </p>
    </div>
  );
};