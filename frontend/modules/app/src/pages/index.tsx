import { appName } from '@services';
import styles from './index.module.scss';
import ProductCard from 'modules/components/src/molecules/ProductCard/ProductCard';
import { useEffect, useState } from 'react';
import {
  addProductToCart,
  Cart,
  deleteItem,
  fetchProducts,
  getCart,
  Product,
} from 'modules/services/apis';
import CartDropDown from 'modules/components/src/molecules/CartDropdown/CartDropDown';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  const [products, setProducts] = useState<Product[]>();
  const [cart, setCart] = useState<Cart[]>();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      localStorage.setItem('cachedProducts', JSON.stringify(data));
    };

    if (navigator.onLine) {
      loadProducts();
    } else {
      const cached = localStorage.getItem('cachedProducts');
      console.log('cached', cached);
      if (cached) setProducts(JSON.parse(cached));
    }

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      getCart().then((cartItem) => {
        setCart(cartItem);
      });
    }
  }, []);

  const onAddToCart = async (cartItem: Cart) => {
    await addProductToCart(cartItem);
    // addToCart(product);
    const cartRes = await getCart();
    setCart(cartRes);
  };

  return (
    <div className={styles.page}>
      <header>
        <h1>Shopping Site 👋</h1>
        <CartDropDown
          cart={cart!}
          onRemove={(removedItem) => deleteItem(removedItem.itemId)}
        />
      </header>
      <div className="wrapper">
        <div className="container">
          <div className={styles.productsGrid}>
            {products?.map(
              ({ sku, description, imageUrl, price, name, quantity }) => (
                <ProductCard
                  key={sku}
                  description={description}
                  image={imageUrl}
                  onAddToCart={() =>
                    onAddToCart({ itemId: sku, name, price, quantity })
                  }
                  price={price.toLocaleString()}
                  title={name}
                  isOnline={isOnline}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
