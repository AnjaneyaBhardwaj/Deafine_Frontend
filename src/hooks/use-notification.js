import { useState, useEffect, useCallback } from 'react';
import { useMobile } from './use-mobile.js';

export const useNotification = () => {
  const isMobile = useMobile();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [visualNotification, setVisualNotification] = useState(null);

  useEffect(() => {
    // Check if we can use notifications
    if (!isMobile && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        setPermissionGranted(permission === 'granted');
      });
    }
  }, [isMobile]);

  const notify = useCallback(({ title, body, haptic = false }) => {
    console.log('🔔 notify() called:', { title, body, haptic });
    
    // Always show visual notification on screen (for all devices)
    const notificationObj = { title, body, haptic, id: Date.now() };
    console.log('🔔 Setting visual notification:', notificationObj);
    setVisualNotification(notificationObj);
    
    // Handle system notification (desktop only)
    if (!isMobile && permissionGranted) {
      console.log('🔔 Showing system notification');
      new Notification(title, {
        body,
        icon: '/logo.png' // Make sure to add your logo in the public folder
      });
    }
    
    // Handle haptic feedback (mobile only)
    if (haptic && 'vibrate' in navigator) {
      console.log('🔔 Triggering vibration');
      // Vibration pattern: 200ms vibrate, 100ms pause, 200ms vibrate
      navigator.vibrate([200, 100, 200]);
    }
  }, [isMobile, permissionGranted]);

  const clearVisualNotification = useCallback(() => {
    setVisualNotification(null);
  }, []);

  return {
    notify,
    visualNotification,
    clearVisualNotification,
    isMobile,
    permissionGranted
  };
};