import React from 'react';
import styles from './navbar.module.scss';
import { CartIconWithDropdown } from '../../cart-icon-with-dropdown/src/CartIconWithDropdown';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Celfocus</div>
      <CartIconWithDropdown />
    </nav>
  );
};
