# OnlineStatusBanner Component

A small, unobtrusive banner that detects and displays the user's internet connection status.

## Features

- 🌐 **Real-time detection** - Monitors online/offline status
- 📱 **Responsive design** - Works on all screen sizes
- 🎨 **Modern styling** - Clean, gradient-based design
- ♿ **Accessibility** - Screen reader friendly
- ⚡ **Smart timing** - Auto-hides after 5 seconds when back online
- 🎯 **Non-intrusive** - Positioned at bottom right

## Usage

```tsx
import { OnlineStatusBanner } from './libs/ui/online-status-banner';

function App() {
  return (
    <div>
      {/* Your app content */}
      <OnlineStatusBanner />
    </div>
  );
}
```

## Behavior

### Default State
- **Online**: Banner is hidden (default state)
- **Offline**: Banner appears immediately

### State Changes
- **Online → Offline**: Banner appears and stays visible
- **Offline → Online**: Banner shows "You are back online!" for 5 seconds, then hides

### Visual States
- **Online**: Green gradient with globe icon 🌐
- **Offline**: Red gradient with signal icon 📡
- **Transitioning**: Pulsing animation when coming back online

## Positioning

- **Desktop**: Bottom right corner (20px from edges)
- **Mobile**: Bottom full width with margins (16px from edges)

## Accessibility

- Uses `role="status"` and `aria-live="polite"`
- Screen readers announce status changes
- High contrast mode support
- Reduced motion support

## Browser Support

- Chrome 14+
- Firefox 3+
- Safari 5+
- Edge 12+

## Dependencies

- React 18+
- SCSS modules
- No external dependencies

## Customization

You can customize the styling by modifying:
- `OnlineStatusBanner.module.scss` - Colors, positioning, animations
- `OnlineStatusBanner.tsx` - Messages, timing, icons 