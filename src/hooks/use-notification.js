import { useState, useEffect } from 'react';
import { useMobile } from './use-mobile.js';

export const useNotification = () => {
  const isMobile = useMobile();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Check if we can use notifications
    if (!isMobile && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        setPermissionGranted(permission === 'granted');
      });
    }
  }, [isMobile]);

  const notify = ({ title, body, haptic = false }) => {
    // Handle system notification
    if (!isMobile && permissionGranted) {
      new Notification(title, {
        body,
        icon: '/logo.png' // Make sure to add your logo in the public folder
      });
    }
    
    // Handle haptic feedback
    if (haptic && isMobile && 'vibrate' in navigator) {
      // Vibration pattern: 200ms vibrate, 100ms pause, 200ms vibrate
      navigator.vibrate([200, 100, 200]);
    }
  };

  return {
    notify,
    isMobile,
    permissionGranted
  };
};