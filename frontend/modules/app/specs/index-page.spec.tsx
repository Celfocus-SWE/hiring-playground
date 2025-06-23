// Clear module cache and set up mocks before any imports
jest.resetModules();

// Mock the DataManager first
const mockDataManager = {
  getProducts: jest.fn(),
  getCartItems: jest.fn(),
  isOnlineMode: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  initialize: jest.fn(),
  refreshAllData: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  getPendingChangesCount: jest.fn(),
};

// Mock the data-manager module
jest.doMock('../libs/services/data-manager', () => ({
  dataManager: mockDataManager,
  DATA_EVENTS: {
    PRODUCTS_UPDATED: 'products_updated',
    CART_UPDATED: 'cart_updated',
    ONLINE_MODE: 'online_mode',
    OFFLINE_MODE: 'offline_mode',
  },
}));

// Mock the cart context
const mockCartItems = [
  {
    id: '1',
    itemId: 'PROD-001',
    name: 'Test Product 1',
    price: 29.99,
    quantity: 2,
    imageUrl: 'test1.jpg',
  },
];

const mockCartActions = {
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  refreshCart: jest.fn(),
  isOnline: true,
  cartItems: mockCartItems,
  loading: false,
  error: null,
  pendingChangesCount: 0,
};

// Mock the cart context with proper provider
jest.doMock('../contexts/cart-context', () => ({
  useCart: jest.fn(() => mockCartActions),
  CartProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="cart-provider">{children}</div>,
}));

// Mock the products service
jest.doMock('../libs/services/products/src/lib/api', () => ({
  getProducts: jest.fn(),
}));

// Mock the useClientSide hook
jest.doMock('../libs/utils/useClientSide', () => ({
  useClientSide: () => true,
}));

// Mock the useToast hook
jest.doMock('../libs/utils/useToast', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }),
}));

// Mock the OnlineStatusBanner component
jest.doMock('../libs/ui/online-status-banner/src/OnlineStatusBanner', () => ({
  OnlineStatusBanner: () => <div role="status">Online</div>,
}));

// Mock the CartIconWithDropdown component
jest.doMock('../libs/ui/cart-icon-with-dropdown/src/CartIconWithDropdown', () => ({
  CartIconWithDropdown: () => <button aria-label="cart">Cart (2)</button>,
}));

// Mock the ProductCard component
jest.doMock('../libs/ui/product-card/src/lib/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
    </div>
  ),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider } from '../contexts/cart-context';

// Import HomePage after mocks are set up
import HomePage from '../src/pages/index';

// Helper function to render HomePage with providers
const renderHomePage = () => {
  return render(
    <CartProvider>
      <HomePage />
    </CartProvider>
  );
};

describe('HomePage', () => {
  const mockProducts = [
    {
      sku: 'PROD-001',
      name: 'Test Product 1',
      description: 'This is a test product description',
      price: 29.99,
      imageUrl: 'test1.jpg',
      category: 'Electronics',
    },
    {
      sku: 'PROD-002',
      name: 'Test Product 2',
      description: 'Another test product description',
      price: 49.99,
      imageUrl: 'test2.jpg',
      category: 'Books',
    },
    {
      sku: 'PROD-003',
      name: 'Test Product 3',
      description: 'Third test product description',
      price: 19.99,
      imageUrl: 'test3.jpg',
      category: 'Accessories',
    },
    {
      sku: 'PROD-004',
      name: 'Test Product 4',
      description: 'Fourth test product description',
      price: 79.99,
      imageUrl: 'test4.jpg',
      category: 'Electronics',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup DataManager mocks
    mockDataManager.getProducts.mockResolvedValue(mockProducts);
    mockDataManager.getCartItems.mockResolvedValue(mockCartItems);
    mockDataManager.isOnlineMode.mockReturnValue(true);
    mockDataManager.initialize.mockResolvedValue(undefined);
    mockDataManager.refreshAllData.mockResolvedValue(undefined);
    mockDataManager.addToCart.mockResolvedValue(undefined);
    mockDataManager.updateCartItem.mockResolvedValue(undefined);
    mockDataManager.removeFromCart.mockResolvedValue(undefined);
    mockDataManager.clearCart.mockResolvedValue(undefined);
    mockDataManager.getPendingChangesCount.mockReturnValue(0);

    // Mock products service
    (require('../libs/services/products/src/lib/api').getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  describe('Rendering', () => {
    it('should render the main page structure', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByText('Welcome to Our Store')).toBeInTheDocument();
        expect(screen.getByText('Discover amazing products')).toBeInTheDocument();
      });
    });

    it('should render product grid', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Test Product 3')).toBeInTheDocument();
        expect(screen.getByText('Test Product 4')).toBeInTheDocument();
      });
    });

    it('should render product cards with correct information', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument();
        expect(screen.getByText('$49.99')).toBeInTheDocument();
        expect(screen.getByText('$19.99')).toBeInTheDocument();
        expect(screen.getByText('$79.99')).toBeInTheDocument();
      });
    });

    it('should render cart icon', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
      });
    });

    it('should render online status banner', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    it('should load products on mount', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(mockDataManager.getProducts).toHaveBeenCalled();
      });
    });

    it('should handle loading state', () => {
      mockDataManager.getProducts.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
      );

      renderHomePage();

      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('should handle products loading error', async () => {
      mockDataManager.getProducts.mockRejectedValue(new Error('Network error'));

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle empty products list', async () => {
      mockDataManager.getProducts.mockResolvedValue([]);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('No products available.')).toBeInTheDocument();
      });
    });
  });

  describe('Product Grid Layout', () => {
    it('should handle responsive grid layout', async () => {
      renderHomePage();

      await waitFor(() => {
        const productCards = screen.getAllByText(/Test Product/);
        expect(productCards).toHaveLength(4);
      });
    });

    it('should render product cards with correct structure', async () => {
      renderHomePage();

      await waitFor(() => {
        const productImages = screen.getAllByAltText(/Test Product/);
        expect(productImages).toHaveLength(4);
        
        const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
        expect(addButtons).toHaveLength(4);
      });
    });
  });

  describe('Cart Integration', () => {
    it('should show current cart items count', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Total items: 2
      });
    });

    it('should handle add to cart from product cards', async () => {
      renderHomePage();

      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
        expect(addButtons).toHaveLength(4);
      });
    });

    it('should update cart when items are added', async () => {
      renderHomePage();

      await waitFor(() => {
        const addButton = screen.getAllByRole('button', { name: /add to cart/i })[0];        
        fireEvent.click(addButton);
      });
    });
  });

  describe('Online/Offline Handling', () => {
    it('should show online status when connected', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Online')).toBeInTheDocument();
      });
    });

    it('should show offline status when disconnected', async () => {
      mockDataManager.isOnlineMode.mockReturnValue(false);
      
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Offline')).toBeInTheDocument();
      });
    });

    it('should disable add to cart buttons when offline', async () => {
      mockDataManager.isOnlineMode.mockReturnValue(false);
      
      renderHomePage();

      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', { name: /offline - no actions/i }); 
        expect(addButtons).toHaveLength(4);
        addButtons.forEach(button => {
          expect(button).toBeDisabled();
        });
      });
    });
  });

  describe('Data Manager Integration', () => {
    it('should listen to data manager events', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(mockDataManager.on).toHaveBeenCalledWith('products_updated', expect.any(Function));
        expect(mockDataManager.on).toHaveBeenCalledWith('cart_updated', expect.any(Function)); 
        expect(mockDataManager.on).toHaveBeenCalledWith('online_mode', expect.any(Function));  
        expect(mockDataManager.on).toHaveBeenCalledWith('offline_mode', expect.any(Function)); 
      });
    });

    it('should remove event listeners on unmount', async () => {
      const { unmount } = renderHomePage();

      await waitFor(() => {
        expect(mockDataManager.on).toHaveBeenCalled();
      });

      unmount();

      expect(mockDataManager.off).toHaveBeenCalledWith('products_updated', expect.any(Function));
      expect(mockDataManager.off).toHaveBeenCalledWith('cart_updated', expect.any(Function));
      expect(mockDataManager.off).toHaveBeenCalledWith('online_mode', expect.any(Function)); 
      expect(mockDataManager.off).toHaveBeenCalledWith('offline_mode', expect.any(Function));
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByText('Welcome to Our Store')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA landmarks', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('banner')).toBeInTheDocument(); // Online status banner        
      });
    });

    it('should have proper button labels', async () => {
      renderHomePage();

      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
        addButtons.forEach(button => {
          expect(button).toHaveAttribute('aria-label');
        });
      });
    });

    it('should have proper image alt text', async () => {
      renderHomePage();

      await waitFor(() => {
        const images = screen.getAllByAltText(/Test Product/);
        expect(images).toHaveLength(4);
      });
    });
  });

  describe('Performance', () => {
    it('should handle large product lists efficiently', async () => {
      const largeProductList = Array.from({ length: 100 }, (_, i) => ({
        sku: `PROD-${i.toString().padStart(3, '0')}`,
        name: `Product ${i}`,
        description: `Product ${i} description`,
        price: Math.random() * 100,
        imageUrl: `product${i}.jpg`,
        category: 'Electronics',
      }));

      mockDataManager.getProducts.mockResolvedValue(largeProductList);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Product 0')).toBeInTheDocument();
        expect(screen.getByText('Product 99')).toBeInTheDocument();
      });
    });

    it('should not re-render unnecessarily', async () => {
      const { rerender } = renderHomePage();

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      const main = screen.getByRole('main');
      const initialMain = main;

      rerender(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBe(initialMain);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockDataManager.getProducts.mockRejectedValue(new Error('Failed to load products'));

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Failed to load products')).toBeInTheDocument();
      });
    });

    it('should handle malformed product data', async () => {
      const malformedProducts = [
        {
          sku: 'PROD-001',
          name: 'Valid Product',
          price: 29.99,
          imageUrl: 'valid.jpg',
          category: 'Electronics',
        },
        {
          sku: 'PROD-002',
          name: 'Invalid Product',
          // Missing required fields
        },
      ];

      mockDataManager.getProducts.mockResolvedValue(malformedProducts);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Valid Product')).toBeInTheDocument();
        expect(screen.getByText('Invalid Product')).toBeInTheDocument();
      });
    });

    it('should handle data manager initialization errors', () => {
      mockDataManager.initialize.mockImplementation(() => {
        throw new Error('Initialization failed');
      });

      renderHomePage();

      expect(screen.getByText('Failed to initialize application')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with special characters', async () => {
      const specialProducts = [
        {
          sku: 'PROD-001',
          name: 'Product with & special <characters>',
          description: 'Product with special characters',
          price: 29.99,
          imageUrl: 'special.jpg',
          category: 'Electronics',
        },
      ];

      mockDataManager.getProducts.mockResolvedValue(specialProducts);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Product with & special <characters>')).toBeInTheDocument(); 
      });
    });

    it('should handle products with very long names', async () => {
      const longNameProducts = [
        {
          sku: 'PROD-001',
          name: 'This is a very long product name that should be handled properly by the UI components and should not break the layout or cause any rendering issues',
          description: 'Long name product',
          price: 29.99,
          imageUrl: 'long.jpg',
          category: 'Electronics',
        },
      ];

      mockDataManager.getProducts.mockResolvedValue(longNameProducts);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText(/This is a very long product name/)).toBeInTheDocument();    
      });
    });

    it('should handle zero price products', async () => {
      const zeroPriceProducts = [
        {
          sku: 'PROD-001',
          name: 'Free Product',
          description: 'A free product',
          price: 0,
          imageUrl: 'free.jpg',
          category: 'Electronics',
        },
      ];

      mockDataManager.getProducts.mockResolvedValue(zeroPriceProducts);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Free Product')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
      });
    });

    it('should handle very high price products', async () => {
      const highPriceProducts = [
        {
          sku: 'PROD-001',
          name: 'Expensive Product',
          description: 'A very expensive product',
          price: 999999.99,
          imageUrl: 'expensive.jpg',
          category: 'Electronics',
        },
      ];

      mockDataManager.getProducts.mockResolvedValue(highPriceProducts);

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Expensive Product')).toBeInTheDocument();
        expect(screen.getByText('$999,999.99')).toBeInTheDocument();
      });
    });
  });
}); 