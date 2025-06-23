import React from 'react';
import { useToast } from '../../utils/useToast';
import styles from './NotificationControls.module.scss';

export const NotificationControls: React.FC = () => {
  const { enable, disable, isEnabled, clear } = useToast();
  const [enabled, setEnabled] = React.useState(isEnabled());

  const handleToggle = () => {
    if (enabled) {
      disable();
      setEnabled(false);
    } else {
      enable();
      setEnabled(true);
    }
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div className={styles.controls}>
      <div className={styles.control}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.label}>
          {enabled ? 'Notifications Enabled' : 'Notifications Disabled'}
        </span>
      </div>
      
      {enabled && (
        <button
          onClick={handleClear}
          className={styles.clearButton}
          title="Clear all notifications"
        >
          Clear All
        </button>
      )}
    </div>
  );
}; 