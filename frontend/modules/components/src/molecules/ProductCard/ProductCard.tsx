import React, { useState } from 'react';
import { ProductCardProps } from './types';
import styles from './ProductCard.module.scss';

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  onAddToCart,
  isOnline = true,
}) => {
  const [showDescription, setshowDescription] = useState(false);
  return (
    <>
      <div
        className={styles.productCard}
        onMouseOver={() => setshowDescription(true)}
        onMouseLeave={() => setshowDescription(false)}
      >
        <img src={image} alt={title} className={styles.productImage} />
        <h2 className={styles.productTitle}>{title}</h2>
        {/* <p className={styles.productDescription}>{description}</p> */}
        <p className={styles.productPrice}>{price}€</p>
        <button
          onClick={onAddToCart}
          disabled={!isOnline}
          className={styles.addToCartButton}
          title={isOnline ? 'Add to Cart' : 'You are offline'}
        >
          Add to Cart
        </button>
        {showDescription && (
          <div className={styles.productDescription}>
            <p>{description}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCard;
