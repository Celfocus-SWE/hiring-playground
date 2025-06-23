import { useState, useEffect, useCallback } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isServiceWorkerActive: boolean;
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isServiceWorkerActive: false
  });
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Check if the app is running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInstalled) {
      // PWA was installed
      setPwaStatus(prev => ({ ...prev, isInstalled: true }));
      return true;
    }
    
    return false;
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setPwaStatus(prev => ({ ...prev, isServiceWorkerActive: true }));
            }
          });
        }
      });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker available
        setPwaStatus(prev => ({ ...prev, isServiceWorkerActive: false }));
      });

      setPwaStatus(prev => ({ ...prev, isServiceWorkerActive: true }));
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, []);

  // Handle install prompt
  const handleInstallPrompt = useCallback((event: Event) => {
    event.preventDefault();
    setInstallPrompt(event as InstallPromptEvent);
    setPwaStatus(prev => ({ ...prev, isInstallable: true }));
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // PWA installed successfully
        setPwaStatus(prev => ({ 
          ...prev, 
          isInstalled: true,
          isInstallable: false 
        }));
      } else {
        // PWA installation dismissed
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
  }, [installPrompt]);

  // Check online status
  const checkOnlineStatus = useCallback(() => {
    setPwaStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Initialize PWA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Register service worker
      registerServiceWorker();

      // Check if already installed
      const isInstalled = checkIfInstalled();
      setPwaStatus(prev => ({ ...prev, isInstalled }));

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', handleInstallPrompt);

      // Listen for online/offline events
      window.addEventListener('online', checkOnlineStatus);
      window.addEventListener('offline', checkOnlineStatus);

      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        setPwaStatus(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false 
        }));
      });

      return () => {
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        window.removeEventListener('online', checkOnlineStatus);
        window.removeEventListener('offline', checkOnlineStatus);
      };
    }
  }, [registerServiceWorker, checkIfInstalled, handleInstallPrompt, checkOnlineStatus]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send push notification (for testing)
  const sendTestNotification = useCallback(async () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      if (Notification.permission === 'granted') {
        await registration.showNotification('Celfocus Shopping', {
          body: 'Test notification from PWA!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png'
        } as NotificationOptions);
      }
    }
  }, []);

  // Register background sync
  const registerBackgroundSync = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      if ('sync' in registration) {
        // Background sync registered
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }, []);

  return {
    pwaStatus,
    installPWA,
    requestNotificationPermission,
    sendTestNotification,
    registerBackgroundSync,
    registerServiceWorker
  };
}; 