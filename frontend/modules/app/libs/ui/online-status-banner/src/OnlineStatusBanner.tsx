'use client';
import React, { useState, useEffect } from 'react';
import styles from './OnlineStatusBanner.module.scss';

export const OnlineStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false); // Don't show initially
  const [isVisible, setIsVisible] = useState(false); // Don't show initially
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false); // Track if we've been offline

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      const wasOffline = !isOnline;
      setIsOnline(true);
      
      // Only show banner if we were previously offline
      if (wasOffline && hasBeenOffline) {
        setIsTransitioning(true);
        setShowBanner(true);
        setIsVisible(true);
        
        // Hide banner after 5 seconds when coming back online
        setTimeout(() => {
          setIsVisible(false);
          // Wait for fade-out animation to complete before hiding
          setTimeout(() => {
            setShowBanner(false);
            setIsTransitioning(false);
          }, 400); // Match transition duration
        }, 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true); // Mark that we've been offline
      setIsTransitioning(false);
      setShowBanner(true);
      
      // Small delay to ensure smooth fade-in animation
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, hasBeenOffline]);

  // Handle fade out when going from offline to online
  useEffect(() => {
    if (isOnline && showBanner && !isTransitioning) {
      // User came back online, fade out the offline banner
      setIsVisible(false);
      setTimeout(() => {
        setShowBanner(false);
      }, 400); // Match transition duration
    }
  }, [isOnline, showBanner, isTransitioning]);

  // Don't show banner if we're online and haven't been offline
  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className={`${styles.banner} ${isVisible ? styles.show : ''} ${isOnline ? styles.online : styles.offline} ${isTransitioning ? styles.transitioning : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Online status"
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          {isOnline ? '🌐' : '📡'}
        </div>
        <div className={styles.message}>
          <div className={styles.status}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className={styles.description}>
            {isOnline ? 'You are connected to the internet' : 'You are currently offline'}
          </div>
        </div>
      </div>
    </div>
  );
}; 