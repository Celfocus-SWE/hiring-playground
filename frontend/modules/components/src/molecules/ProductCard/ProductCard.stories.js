import React from 'react';
import ProductCard from './ProductCard.js';

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
  argTypes: {
    // Style controls
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'elevated', 'bordered', 'minimal'],
      description: 'Visual style variant of the card',
      defaultValue: 'default'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the card',
      defaultValue: 'medium'
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'blue', 'green', 'purple'],
      description: 'Color theme of the card',
      defaultValue: 'light'
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 20, step: 2 },
      description: 'Border radius in pixels',
      defaultValue: 8
    },
    shadow: {
      control: { type: 'select' },
      options: ['none', 'small', 'medium', 'large'],
      description: 'Shadow intensity',
      defaultValue: 'medium'
    },
    imageStyle: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'fill'],
      description: 'Image fitting style',
      defaultValue: 'cover'
    },
    // Functional controls
    showPrice: {
      control: { type: 'boolean' },
      description: 'Show/hide price',
      defaultValue: true
    },
    showAddToCart: {
      control: { type: 'boolean' },
      description: 'Show/hide add to cart button',
      defaultValue: true
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
# ProductCard Component

A comprehensive product card component that displays product information with advanced cart functionality.

## Features

- **Product Display**: Shows product image, name, price, and description
- **Add to Cart**: Interactive button with different states (add, add more, offline)
- **Offline Support**: Handles offline state with disabled actions
- **Product Details Modal**: Hover over image to see detailed product information
- **Cart Integration**: Shows current quantity if item is in cart
- **Loading States**: Displays loading state during cart operations
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Style Options

### Variants
- **default**: Standard card design
- **compact**: Smaller, more condensed layout
- **elevated**: Card with prominent shadow
- **bordered**: Card with visible border
- **minimal**: Clean, minimal design

### Themes
- **light**: Light background with dark text
- **dark**: Dark background with light text
- **blue**: Blue accent colors
- **green**: Green accent colors
- **purple**: Purple accent colors

### Sizes
- **small**: Compact card size
- **medium**: Standard card size
- **large**: Larger card size

## Usage

\`\`\`tsx
import { ProductCard } from './ProductCard';

<ProductCard 
  product={{
    sku: "PROD-001",
    name: "Product Name",
    description: "Product description",
    price: 29.99,
    imageUrl: "product-image.jpg",
    category: "Electronics"
  }}
  onAddToCart={(sku, quantity) => console.log('Added to cart!')}
  isOnline={true}
  cart={{ items: [] }}
  isAdding={false}
  variant="elevated"
  theme="blue"
  size="large"
  borderRadius={12}
  shadow="large"
/>
\`\`\`
        `,
      },
    },
  },
};

// Default story
export const Default = {
  args: {
    product: {
      sku: "PROD-001",
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
      price: 129.99,
      imageUrl: "https://picsum.photos/300/200?random=1",
      category: "Electronics"
    },
    onAddToCart: (sku, quantity) => console.log('Added to cart:', sku, quantity),
    isOnline: true,
    cart: { items: [] },
    isAdding: false,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    borderRadius: 8,
    shadow: 'medium',
    imageStyle: 'cover',
    showPrice: true,
    showAddToCart: true
  }
};

// Product in cart story
export const InCart = {
  args: {
    product: {
      sku: "PROD-002",
      name: "Premium Smart Watch",
      description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
      price: 299.99,
      imageUrl: "https://picsum.photos/300/200?random=2",
      category: "Wearables"
    },
    onAddToCart: (sku, quantity) => console.log('Added to cart:', sku, quantity),
    isOnline: true,
    cart: { 
      items: [
        { itemId: "PROD-002", quantity: 2 }
      ] 
    },
    isAdding: false,
    variant: 'elevated',
    size: 'medium',
    theme: 'green',
    borderRadius: 12,
    shadow: 'large',
    imageStyle: 'cover',
    showPrice: true,
    showAddToCart: true
  }
};

// Offline story
export const Offline = {
  args: {
    product: {
      sku: "PROD-003",
      name: "Laptop Stand",
      description: "Ergonomic laptop stand with adjustable height and cooling features.",
      price: 49.99,
      imageUrl: "https://picsum.photos/300/200?random=3",
      category: "Accessories"
    },
    onAddToCart: (sku, quantity) => console.log('Added to cart:', sku, quantity),
    isOnline: false,
    cart: { items: [] },
    isAdding: false,
    variant: 'bordered',
    size: 'medium',
    theme: 'dark',
    borderRadius: 4,
    shadow: 'none',
    imageStyle: 'cover',
    showPrice: true,
    showAddToCart: true
  }
}; 