import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export const NotificationPopup = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  console.log('🔔 NotificationPopup RENDER - notification:', notification, 'isVisible:', isVisible, 'isLeaving:', isLeaving);

  useEffect(() => {
    console.log('🔔 NotificationPopup useEffect - notification:', notification);
    if (notification) {
      console.log('🔔 NotificationPopup - showing notification');
      // Trigger entrance animation
      setTimeout(() => {
        console.log('🔔 NotificationPopup - setting isVisible to true');
        setIsVisible(true);
      }, 10);
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        console.log('🔔 NotificationPopup - auto-closing after 5s');
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      console.log('🔔 NotificationPopup - notification is null, resetting visibility');
      setIsVisible(false);
      setIsLeaving(false);
    }
  }, [notification]);

  const handleClose = () => {
    console.log('🔔 NotificationPopup - handleClose called');
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!notification) {
    console.log('🔔 NotificationPopup - returning null (no notification)');
    return null;
  }

  console.log('🔔 NotificationPopup - rendering notification popup');

  return (
    <div
      className={cn(
        "fixed top-3 right-3 sm:top-4 sm:right-4 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-sm w-full sm:w-96",
        "transition-all duration-300 ease-in-out",
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-blue-500 to-purple-600",
          "text-white rounded-lg shadow-2xl p-3 sm:p-4",
          "border-2 border-white/20",
          "backdrop-blur-sm",
          notification.haptic && "animate-pulse-slow"
        )}
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              {notification.haptic && (
                <span className="text-xl sm:text-2xl flex-shrink-0" role="img" aria-label="notification">
                  📳
                </span>
              )}
              <h3 className="font-bold text-base sm:text-lg leading-tight truncate">
                {notification.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed break-words">
              {notification.body}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full",
              "bg-white/20 hover:bg-white/30",
              "flex items-center justify-center",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/50"
            )}
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
