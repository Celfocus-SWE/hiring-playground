import React, { useState, useRef, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  isOnline = true, 
  cart = { items: [] }, 
  isAdding = false,
  // Style props
  variant = 'default',
  size = 'medium',
  theme = 'light',
  borderRadius = 8,
  shadow = 'medium',
  imageStyle = 'cover',
  showPrice = true,
  showAddToCart = true
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const cardRef = useRef(null);
  const modalRef = useRef(null);

  // Theme configurations
  const themes = {
    light: {
      background: '#fff',
      textColor: '#333',
      borderColor: '#eee',
      priceColor: '#2c3e50',
      buttonColor: '#0070f3',
      buttonHoverColor: '#0056b3'
    },
    dark: {
      background: '#2c3e50',
      textColor: '#fff',
      borderColor: '#34495e',
      priceColor: '#ecf0f1',
      buttonColor: '#3498db',
      buttonHoverColor: '#2980b9'
    },
    blue: {
      background: '#f8f9ff',
      textColor: '#2c3e50',
      borderColor: '#e3f2fd',
      priceColor: '#1976d2',
      buttonColor: '#2196f3',
      buttonHoverColor: '#1976d2'
    },
    green: {
      background: '#f8fff9',
      textColor: '#2c3e50',
      borderColor: '#e8f5e8',
      priceColor: '#27ae60',
      buttonColor: '#27ae60',
      buttonHoverColor: '#229954'
    },
    purple: {
      background: '#faf8ff',
      textColor: '#2c3e50',
      borderColor: '#f3e5f5',
      priceColor: '#8e44ad',
      buttonColor: '#9c27b0',
      buttonHoverColor: '#7b1fa2'
    }
  };

  // Size configurations
  const sizes = {
    small: {
      width: '220px',
      imageHeight: '150px',
      padding: '12px',
      fontSize: '14px',
      priceFontSize: '16px'
    },
    medium: {
      width: '280px',
      imageHeight: '200px',
      padding: '16px',
      fontSize: '16px',
      priceFontSize: '18px'
    },
    large: {
      width: '340px',
      imageHeight: '250px',
      padding: '20px',
      fontSize: '18px',
      priceFontSize: '22px'
    }
  };

  // Shadow configurations
  const shadows = {
    none: 'none',
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.05)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12)'
  };

  // Variant configurations
  const variants = {
    default: {
      border: `1px solid ${themes[theme].borderColor}`,
      background: themes[theme].background
    },
    compact: {
      border: `1px solid ${themes[theme].borderColor}`,
      background: themes[theme].background
    },
    elevated: {
      border: 'none',
      background: themes[theme].background
    },
    bordered: {
      border: `2px solid ${themes[theme].borderColor}`,
      background: themes[theme].background
    },
    minimal: {
      border: 'none',
      background: 'transparent'
    }
  };

  const currentTheme = themes[theme];
  const currentSize = sizes[size];
  const currentShadow = shadows[shadow];
  const currentVariant = variants[variant];

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdding || !isOnline) return;
    
    console.log('Adding to cart:', product.sku, 'Online:', isOnline);
    onAddToCart && onAddToCart(product.sku, 1);
  };

  const handleMouseEnter = () => {
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
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setIsLoadingModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  useEffect(() => {
    const handleEscape = (e) => {
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
      if (showModal) {
        document.body.classList.remove('modal-open');
      }
    };
  }, [hoverTimer, showModal]);

  const cartItem = cart.items.find((item) => item.itemId === product.sku);
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

  const styles = {
    productCard: {
      ...currentVariant,
      borderRadius: `${borderRadius}px`,
      overflow: 'hidden',
      boxShadow: currentShadow,
      transition: 'all 0.3s ease',
      width: currentSize.width,
      height: '100%',
      position: 'relative',
      cursor: 'default',
      color: currentTheme.textColor,
      // Add hover effects
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
      }
    },
    imageContainer: {
      width: '100%',
      height: currentSize.imageHeight,
      overflow: 'hidden',
      background: '#f8f9fa',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: imageStyle,
      transition: 'transform 0.3s ease'
    },
    content: {
      padding: currentSize.padding,
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100% - ${currentSize.imageHeight})`
    },
    name: {
      fontSize: currentSize.fontSize,
      fontWeight: '600',
      color: currentTheme.textColor,
      margin: '0 0 8px 0',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    price: {
      fontSize: currentSize.priceFontSize,
      fontWeight: '700',
      color: currentTheme.priceColor,
      margin: '0 0 16px 0',
      display: showPrice ? 'block' : 'none'
    },
    cartInfo: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    quantityInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #e9ecef'
    },
    quantityLabel: {
      fontSize: '12px',
      color: '#6c757d',
      fontWeight: '500'
    },
    quantityValue: {
      fontSize: '14px',
      color: '#27ae60',
      fontWeight: '600',
      background: '#e8f5e8',
      padding: '2px 8px',
      borderRadius: '4px',
      minWidth: '20px',
      textAlign: 'center'
    },
    addButton: {
      background: isInCart ? '#27ae60' : currentTheme.buttonColor,
      color: 'white',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      width: '100%',
      opacity: isButtonDisabled ? 0.7 : 1,
      display: showAddToCart ? 'block' : 'none'
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
      animation: 'fadeInLoader 0.3s ease-out',
      pointerEvents: 'none'
    },
    loader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    loaderSpinner: {
      width: '32px',
      height: '32px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #0070f3',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loaderText: {
      fontSize: '14px',
      color: '#666',
      fontWeight: '500',
      textAlign: 'center'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s ease-out',
      padding: '20px',
      cursor: 'pointer'
    },
    modal: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      animation: 'slideIn 0.3s ease-out',
      position: 'relative',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #eee',
      background: '#f8f9fa',
      flexShrink: 0
    },
    modalTitle: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '600',
      color: '#333'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#666',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'all 0.2s ease'
    },
    modalContent: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto',
      flex: 1,
      maxHeight: 'calc(90vh - 80px)'
    },
    modalImage: {
      textAlign: 'center',
      flexShrink: 0
    },
    modalImageImg: {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    modalDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    modalDescription: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#555',
      margin: 0
    },
    modalInfo: {
      fontSize: '14px',
      color: '#666',
      padding: '8px 12px',
      background: '#f8f9fa',
      borderRadius: '6px',
      borderLeft: '4px solid #0070f3'
    },
    modalPrice: {
      fontSize: '14px',
      color: '#666',
      padding: '8px 12px',
      background: '#f0f8f0',
      borderRadius: '6px',
      borderLeft: '4px solid #27ae60',
      display: showPrice ? 'block' : 'none'
    },
    modalSku: {
      fontSize: '14px',
      color: '#666',
      padding: '8px 12px',
      background: '#f8f9fa',
      borderRadius: '6px',
      borderLeft: '4px solid #6c757d'
    }
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('div', {
      key: 'card',
      className: 'product-card',
      style: styles.productCard,
      ref: cardRef,
      'data-theme': theme,
      'data-size': size,
      'data-variant': variant,
      'data-shadow': shadow
    }, [
      React.createElement('div', {
        key: 'imageContainer',
        style: styles.imageContainer,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }, [
        React.createElement('img', {
          key: 'image',
          src: product.imageUrl,
          alt: product.name,
          className: 'product-image',
          style: styles.image
        }),
        isLoadingModal && React.createElement('div', {
          key: 'loadingOverlay',
          className: 'loading-overlay',
          style: styles.loadingOverlay
        }, React.createElement('div', {
          style: styles.loader
        }, [
          React.createElement('div', {
            key: 'spinner',
            className: 'loader-spinner',
            style: styles.loaderSpinner
          }),
          React.createElement('span', {
            key: 'text',
            style: styles.loaderText
          }, 'Loading details...')
        ]))
      ]),
      React.createElement('div', {
        key: 'content',
        style: styles.content
      }, [
        React.createElement('h3', {
          key: 'name',
          style: styles.name
        }, product.name),
        showPrice && React.createElement('div', {
          key: 'price',
          style: styles.price
        }, `$${product.price.toFixed(2)}`),
        React.createElement('div', {
          key: 'cartInfo',
          style: styles.cartInfo
        }, [
          isInCart && React.createElement('div', {
            key: 'quantityInfo',
            style: styles.quantityInfo
          }, [
            React.createElement('span', {
              key: 'label',
              style: styles.quantityLabel
            }, 'Current quantity:'),
            React.createElement('span', {
              key: 'value',
              style: styles.quantityValue
            }, quantity)
          ]),
          showAddToCart && React.createElement('button', {
            key: 'button',
            onClick: handleAddToCart,
            disabled: isButtonDisabled,
            className: 'add-to-cart-button',
            style: styles.addButton,
            title: !isOnline ? 'Cart actions are disabled while offline' : (isInCart ? `Add 1 more ${product.name} to cart` : `Add ${product.name} to cart`)
          }, getButtonText())
        ])
      ])
    ]),
    showModal && React.createElement('div', {
      key: 'modalOverlay',
      className: 'modal-overlay',
      style: styles.modalOverlay,
      onClick: handleOverlayClick
    }, React.createElement('div', {
      className: 'modal-content',
      style: styles.modal,
      ref: modalRef,
      onClick: handleModalClick
    }, [
      React.createElement('div', {
        key: 'header',
        style: styles.modalHeader
      }, [
        React.createElement('h2', {
          key: 'title',
          style: styles.modalTitle
        }, product.name),
        React.createElement('button', {
          key: 'close',
          style: styles.closeButton,
          onClick: handleCloseModal,
          'aria-label': 'Close modal'
        }, '×')
      ]),
      React.createElement('div', {
        key: 'content',
        style: styles.modalContent
      }, [
        React.createElement('div', {
          key: 'image',
          style: styles.modalImage
        }, React.createElement('img', {
          src: product.imageUrl,
          alt: product.name,
          style: styles.modalImageImg
        })),
        React.createElement('div', {
          key: 'details',
          style: styles.modalDetails
        }, [
          React.createElement('p', {
            key: 'description',
            style: styles.modalDescription
          }, product.description),
          React.createElement('div', {
            key: 'category',
            style: styles.modalInfo
          }, [
            React.createElement('strong', { key: 'catLabel' }, 'Category: '),
            product.category
          ]),
          showPrice && React.createElement('div', {
            key: 'price',
            style: styles.modalPrice
          }, [
            React.createElement('strong', { key: 'priceLabel' }, 'Price: '),
            `$${product.price.toFixed(2)}`
          ]),
          React.createElement('div', {
            key: 'sku',
            style: styles.modalSku
          }, [
            React.createElement('strong', { key: 'skuLabel' }, 'SKU: '),
            product.sku
          ])
        ])
      ])
    ]))
  ]);
};

export default ProductCard; 