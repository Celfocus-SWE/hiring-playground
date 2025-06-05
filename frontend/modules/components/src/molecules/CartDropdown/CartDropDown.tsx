'use client';
import { CartProps } from './types';
import { useState } from 'react';
import styles from './CartDropDown.module.scss';

type Props = {
  cart: CartProps;
  onRemove: (cart: CartProps) => void;
  onCheckout?: () => void;
};

const CartDropdown = ({ cart, onRemove, onCheckout }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.cartWrapper}>
      <button
        className={styles.cartIcon}
        onClick={() => setOpen(!open)}
      ></button>

      {open && (
        <div className={styles.cartBox}>
          <button className={styles.closeBtn} onClick={() => setOpen(false)}>
            ×
          </button>
          {!cart ? (
            <p style={{ color: 'white' }}>Your cart is empty</p>
          ) : (
            <div className={styles.cartItems}>
              {/* {cart?.map((item, idx) => ( */}
              <div key={cart.itemId} className={styles.cartItem}>
                <div>
                  {cart.name} - {cart.price}€
                </div>
                <button
                  onClick={() => onRemove(cart)}
                  className={styles.removeBtn}
                ></button>
              </div>
              {/* ))} */}
            </div>
          )}
          <button className={styles.checkoutBtn} onClick={() => onCheckout?.()}>
            Go to checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
