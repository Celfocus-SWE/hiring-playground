// components/CartIconWithDropdown.tsx
'use client';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styles from './CartIconWithDropdown.module.scss';
import { useCart } from '../../../contexts/cart-context';
import { CartItem } from '../../../api/cartService';
import Image from 'next/image';

export const CartIconWithDropdown: React.FC = () => {
  const { 
    cart, 
    isOnline, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate derived values from cart items
  const itemCount = useMemo(() => 
    (cart.items || []).reduce((sum: number, item: CartItem) => sum + item.quantity, 0), 
    [cart.items]
  );

  const totalPrice = useMemo(() => 
    (cart.items || []).reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0), 
    [cart.items]
  );

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when dropdown is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !isOnline) return;
    
    setIsUpdating(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  }, [updateQuantity, isOnline]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    if (!isOnline) return;
    
    setIsUpdating(itemId);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(null);
    }
  }, [removeFromCart, isOnline]);

  const handleClearCart = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      await clearCart();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [clearCart, isOnline]);

  const handleCheckout = () => {
    // Checkout functionality would go here
    // For now, just close the dropdown
    setIsOpen(false);
  };

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  return (
    <>
      <div className={styles.cartContainer} ref={dropdownRef}>
        <button 
          className={styles.cartIcon} 
          onClick={toggleDropdown}
          aria-label={`Shopping cart (${itemCount} items)`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className={styles.cartIconText}>🛒</span>
          {itemCount > 0 && (
            <span className={styles.badge} aria-label={`${itemCount} items in cart`}>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div 
            className={`${styles.dropdown} ${isMobile ? styles.mobileDropdown : ''}`}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            <div className={styles.header}>
              <h3>Shopping Cart</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {(cart.items || []).length === 0 ? (
              <div className={styles.emptyCart}>
                <span className={styles.emptyCartIcon}>🛍️</span>
                <p>Your cart is empty</p>
                <small>Add some products to get started!</small>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  {(cart.items || []).map((item: CartItem) => (
                    <div key={item.itemId} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={48}
                            height={48}
                            className={styles.productImage}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <span>📦</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
                        <div className={styles.itemTotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className={styles.itemActions}>
                        <div className={styles.quantityControls}>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                            disabled={isUpdating === item.itemId || item.quantity <= 1 || !isOnline}
                            className={`${styles.quantityButton} ${!isOnline ? styles.offlineButton : ''}`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            −
                          </button>
                          <span className={styles.quantity} aria-label={`Quantity: ${item.quantity}`}>
                            {isUpdating === item.itemId ? (
                              <div className={styles.miniSpinner}></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                            disabled={isUpdating === item.itemId || !isOnline}
                            className={`${styles.quantityButton} ${!isOnline ? styles.offlineButton : ''}`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.itemId)}
                          disabled={isUpdating === item.itemId || !isOnline}
                          className={`${styles.removeButton} ${!isOnline ? styles.offlineButton : ''}`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          {isUpdating === item.itemId ? (
                            <div className={styles.miniSpinner}></div>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.footer}>
                  <div className={styles.total}>
                    <strong>Total: ${totalPrice.toFixed(2)}</strong>
                  </div>
                  
                  <div className={styles.actions}>
                    <button
                      onClick={handleClearCart}
                      disabled={!isOnline}
                      className={`${styles.clearButton} ${!isOnline ? styles.offlineButton : ''}`}
                      aria-label="Clear all items from cart"
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={(cart.items || []).length === 0 || !isOnline}
                      className={`${styles.checkoutButton} ${!isOnline ? styles.offlineButton : ''}`}
                      aria-label={`Proceed to checkout (${itemCount} items)`}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile backdrop overlay */}
      {isOpen && isMobile && (
        <div 
          className={styles.backdrop}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
    </>
  );
};
