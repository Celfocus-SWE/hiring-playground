# CartIconWithDropdown Component

A modern, accessible shopping cart dropdown component with comprehensive functionality and beautiful styling.

## Features

- 🛒 **Interactive Cart Icon** - Shows item count with animated badge
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- ♿ **Accessibility** - Full ARIA support and keyboard navigation
- 🎨 **Modern Styling** - Beautiful animations and hover effects
- 🔄 **Loading States** - Individual item loading indicators
- 🚫 **Error Handling** - Graceful error display and recovery
- 🎯 **User Experience** - Click outside to close, escape key support
- 🌙 **Theme Support** - High contrast and reduced motion support

## Usage

```tsx
import { CartIconWithDropdown } from './libs/ui/cart-icon-with-dropdown';

function App() {
  return (
    <CartProvider>
      <CartIconWithDropdown />
    </CartProvider>
  );
}
```

## Props

This component doesn't accept any props as it uses the cart context for all data and functionality.

## Dependencies

- React 18.3.1+
- Next.js 14.2.15+
- Cart Context (must be wrapped in CartProvider)
- SCSS modules

## Features in Detail

### Cart Icon
- Displays shopping cart emoji with item count badge
- Badge shows "99+" for counts over 99
- Hover effects with subtle animations
- Focus states for keyboard navigation

### Dropdown
- **Header**: Title with close button
- **Error Display**: Shows errors with warning icon
- **Loading States**: Spinner for initial load and individual item updates
- **Empty State**: Friendly message when cart is empty
- **Item List**: Each item shows:
  - Product image (with placeholder fallback)
  - Product name and price
  - Quantity controls (+/- buttons)
  - Item total
  - Remove button
- **Footer**: Total price and action buttons

### Interactions
- **Quantity Controls**: Increase/decrease with visual feedback
- **Remove Items**: Individual item removal
- **Clear Cart**: Remove all items at once
- **Checkout**: Placeholder for checkout functionality
- **Close**: Click outside, escape key, or close button

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion support

### Responsive Design
- Mobile-optimized layout
- Touch-friendly button sizes
- Adaptive dropdown positioning
- Flexible item layout

## Styling

The component uses CSS modules with the following key classes:

- `.cartContainer` - Main container
- `.cartIcon` - Cart icon button
- `.badge` - Item count badge
- `.dropdown` - Dropdown container
- `.cartItem` - Individual cart item
- `.quantityControls` - Quantity adjustment buttons
- `.actions` - Action buttons (clear/checkout)

## Customization

You can customize the styling by modifying the SCSS file:
`src/CartIconWithDropdown.module.scss`

Key customization points:
- Colors and themes
- Animations and transitions
- Spacing and layout
- Responsive breakpoints
- Accessibility features

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized with React.memo patterns
- Lazy loading for images
- Efficient re-renders
- Minimal bundle size impact

## Error Handling

The component gracefully handles:
- Network errors
- API failures
- Invalid data
- Loading timeouts

All errors are displayed to the user with clear messaging and recovery options. 