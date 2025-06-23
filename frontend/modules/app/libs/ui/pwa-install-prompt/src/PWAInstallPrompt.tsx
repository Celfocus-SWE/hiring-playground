import React, { useState, useEffect } from 'react';
import { usePWA } from '../../../utils/usePWA';
import styles from './PWAInstallPrompt.module.scss';

export const PWAInstallPrompt: React.FC = () => {
  const { pwaStatus, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show install prompt after a delay if installable and not already installed
    if (pwaStatus.isInstallable && !pwaStatus.isInstalled) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [pwaStatus.isInstallable, pwaStatus.isInstalled]);

  const handleInstall = async () => {
    try {
      await installPWA();
      setIsVisible(false);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.installPrompt}>
      <div className={styles.content}>
        <div className={styles.icon}>
          📱
        </div>
        <div className={styles.text}>
          <h3>Install Celfocus Shopping</h3>
          <p>Add to home screen for a better experience</p>
        </div>
        <div className={styles.actions}>
          <button 
            onClick={handleInstall}
            className={styles.installButton}
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            className={styles.dismissButton}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}; 