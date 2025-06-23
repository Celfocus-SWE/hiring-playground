import React from 'react';
import styles from './footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Celfocus. All rights reserved.</p>
    </footer>
  );
};
