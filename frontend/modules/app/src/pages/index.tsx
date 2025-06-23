import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../libs/ui/product-card/src/lib/ProductCard';
import { CartIconWithDropdown } from '../../libs/ui/cart-icon-with-dropdown/src/CartIconWithDropdown';
import { OnlineStatusBanner } from '../../libs/ui/online-status-banner/src/OnlineStatusBanner';
import { useToast } from '../../libs/utils/useToast';
import { useClientSide } from '../../libs/utils/useClientSide';
import { dataManager, DATA_EVENTS } from '../../libs/services/data-manager';
import { Product } from '../../libs/services/products/src/lib/types';
import styles from './index.module.scss';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true); // Default to true for SSR
  const isClient = useClientSide();
  const toast = useToast();

  // Initialize on client side
  useEffect(() => {
    if (isClient) {
      try {
        dataManager.initialize();
        setIsOnline(dataManager.isOnlineMode());
      } catch (err) {
        console.error('Failed to initialize data manager:', err);
        setError('Failed to initialize application');
      }
    }
  }, [isClient]);

  // Load products only on client side
  useEffect(() => {
    if (isClient) {
      loadProducts();
    }
  }, [isClient]);

  // Listen to data manager events
  useEffect(() => {
    if (!isClient) return;

    const handleProductsUpdate = (updatedProducts: Product[]) => {
      setProducts(updatedProducts);
      setLoading(false);
      setError(null);
    };

    const handleCartUpdate = () => {
      console.log('Cart updated');

      // Cart updated
    };

    const handleOnlineMode = () => {
      setIsOnline(true);
      setError(null);
      toast.success('Back online! Syncing data...');
    };

    const handleOfflineMode = () => {
      setIsOnline(false);
      // toast.warning('You are offline. Using cached data.');
    };

    dataManager.on(DATA_EVENTS.PRODUCTS_UPDATED, handleProductsUpdate);
    dataManager.on(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
    dataManager.on(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
    dataManager.on(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);

    return () => {
      dataManager.off(DATA_EVENTS.PRODUCTS_UPDATED, handleProductsUpdate);
      dataManager.off(DATA_EVENTS.CART_UPDATED, handleCartUpdate);
      dataManager.off(DATA_EVENTS.ONLINE_MODE, handleOnlineMode);
      dataManager.off(DATA_EVENTS.OFFLINE_MODE, handleOfflineMode);
    };
  }, [isClient, toast]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await dataManager.getProducts();
      setProducts(fetchedProducts || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await dataManager.refreshAllData();
      toast.success('Data refreshed successfully!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during SSR or initial client load
  if (!isClient || (loading && products.length === 0)) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Our Store</h1>
      </header>

      {/* {!isOnline && (
        <div className={styles.offlineNotice}>
          <p>
            ⚠️ You are currently offline. Using cached data from local storage.
          </p>
        </div>
      )} */}

      <main className={styles.main}>
        <div className={styles.productsGrid}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.sku}
                product={{
                  ...product,
                  category: product.category || 'Uncategorized',
                }}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No products available.</p>
              <button onClick={handleRefresh} className={styles.retryButton}>
                Refresh
              </button>
            </div>
          )}
        </div>
      </main>

      <OnlineStatusBanner />
    </div>
  );
}
