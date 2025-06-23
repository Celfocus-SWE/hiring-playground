// components/ProductCard.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../../../contexts/cart-context';
import styles from './ProductCard.module.scss';

export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, isOnline } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking the button
    if (isAdding || !isOnline) return;
    
    setIsAdding(true);
    try {
      await addToCart(product.sku, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleMouseEnter = () => {
    // Don't start timer if modal is already open or if any modal is open
    if (showModal || document.body.classList.contains('modal-open')) return;
    
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    setIsLoadingModal(true);
    const timer = setTimeout(() => {
      setShowModal(true);
      setIsLoadingModal(false);
      document.body.classList.add('modal-open');
    }, 1000);
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    // Clear timer when mouse leaves - modal won't open
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setIsLoadingModal(false);
    // Don't close modal if it's already open
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking inside the modal
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        document.body.classList.remove('modal-open');
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
      // Clean up global modal state if this modal was open
      if (showModal) {
        document.body.classList.remove('modal-open');
      }
    };
  }, [hoverTimer, showModal]);

  // Add null check for cart items
  const cartItem = cart.items && Array.isArray(cart.items) 
    ? cart.items.find((item: any) => item.itemId === product.sku)
    : undefined;
  const quantity = cartItem?.quantity || 0;
  const isInCart = quantity > 0;

  const getButtonText = () => {
    if (!isOnline) {
      return 'Offline - No Actions';
    }
    if (isAdding) {
      return 'Adding...';
    }
    if (isInCart) {
      return `Add 1 More (${quantity + 1})`;
    }
    return 'Add to Cart';
  };

  const isButtonDisabled = isAdding || !isOnline;

  return (
    <>
      <div 
        className={styles.productCard} 
        ref={cardRef}
      >
        <div 
          className={styles.imageContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img src={product.imageUrl || ''} alt={product.name} className={styles.image} />
          
          {/* Loading indicator */}
          {isLoadingModal && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loader}>
                <div className={styles.loaderSpinner}></div>
                <span className={styles.loaderText}>Loading details...</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          
          <div className={styles.cartInfo}>
            {isInCart && (
              <div className={styles.quantityInfo}>
                <span className={styles.quantityLabel}>Current quantity:</span>
                <span className={styles.quantityValue}>{quantity}</span>
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`${styles.addButton} ${isInCart ? styles.addMoreButton : ''} ${!isOnline ? styles.offlineButton : ''}`}
              aria-label={!isOnline ? 'Cart actions are disabled while offline' : (isInCart ? `Add 1 more ${product.name} to cart` : `Add ${product.name} to cart`)}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modal} ref={modalRef} onClick={handleModalClick}>
            <div className={styles.modalHeader}>
              <h2>{product.name}</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img src={product.imageUrl || ''} alt={product.name} />
              </div>
              <div className={styles.modalDetails}>
                <p className={styles.modalDescription}>{product.description}</p>
                <div className={styles.modalPrice}>${product.price.toFixed(2)}</div>
                <div className={styles.modalCategory}>Category: {product.category || 'Uncategorized'}</div>
                <div className={styles.modalSku}>SKU: {product.sku}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
