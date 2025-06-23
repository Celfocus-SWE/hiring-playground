# Storybook Setup Guide for Homepage Component

## Overview
This guide explains how to set up Storybook for the Celfocus Shopping App components, including the Homepage component.

## Current Storybook Setup

### ✅ **Working Components**
- **ProductCard** (in `modules/components`) - Basic product card with add to cart functionality
- **CartIconWithDropdown** - Cart icon with dropdown menu
- **OnlineStatusBanner** - Online/offline status indicator
- **PWAInstallPrompt** - PWA installation prompt

### 🔧 **Homepage Component Storybook Setup**

The Homepage component (`src/pages/index.tsx`) is a complex page component that requires special handling for Storybook due to its dependencies:

#### **Dependencies to Mock:**
1. **Data Manager** - Handles API calls and offline caching
2. **Cart Context** - Provides cart state and functions
3. **Toast Notifications** - User feedback system
4. **Client-Side Detection** - SSR/CSR handling
5. **Online Status** - Network connectivity

#### **Recommended Approach:**

1. **Create a Simplified Homepage Component for Storybook**
   ```tsx
   // HomePage.stories.tsx
   import React from 'react';
   import { Story, Meta } from '@storybook/react';
   
   // Mock the complex dependencies
   const mockDataManager = {
     initialize: () => {},
     getProducts: () => Promise.resolve(mockProducts),
     isOnlineMode: () => true,
   };
   
   const mockProducts = [
     {
       sku: 'PROD-001',
       name: 'Wireless Headphones',
       description: 'High-quality wireless headphones',
       price: 129.99,
       imageUrl: 'https://picsum.photos/400/400?random=1',
       category: 'Electronics',
     },
     // ... more products
   ];
   
   export default {
     title: 'Pages/HomePage',
     component: HomePage,
   } as Meta;
   
   const Template: Story = (args) => <HomePage {...args} />;
   
   export const Default = Template.bind({});
   export const Loading = Template.bind({});
   export const Error = Template.bind({});
   export const Offline = Template.bind({});
   export const Empty = Template.bind({});
   ```

2. **Create Story Variants:**
   - **Default** - Normal state with products
   - **Loading** - Loading spinner state
   - **Error** - Error state with retry button
   - **Offline** - Offline mode with cached data
   - **Empty** - No products available
   - **Mobile/Tablet/Desktop** - Responsive views

## 🚀 **How to Run Storybook**

### **For Components Module:**
```bash
cd frontend/modules/components
npm run storybook
```

### **For App Module (if configured):**
```bash
cd frontend/modules/app
npm run storybook
```

## 📱 **Storybook Features**

### **Available Stories:**
1. **ProductCard**
   - Default product display
   - Long description handling
   - Expensive/cheap products
   - Mobile responsive view

2. **CartIconWithDropdown**
   - Empty cart state
   - Items in cart
   - Offline mode
   - Loading states

3. **OnlineStatusBanner**
   - Online state (green)
   - Offline state (red)
   - Animation states

4. **PWAInstallPrompt**
   - Install prompt display
   - Dismissed state
   - Mobile/desktop views

## 🎨 **Storybook Configuration**

### **Required Setup:**
1. **Storybook Dependencies** (in `package.json`):
   ```json
   {
     "dependencies": {
       "@storybook/react-webpack5": "^8.4.4"
     }
   }
   ```

2. **Storybook Configuration** (`.storybook/main.js`):
   ```js
   module.exports = {
     stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
     addons: ['@storybook/addon-essentials'],
     framework: '@storybook/react-webpack5',
   };
   ```

3. **TypeScript Support** (`.storybook/tsconfig.json`):
   ```json
   {
     "extends": "../tsconfig.json",
     "compilerOptions": {
       "allowJs": true,
       "checkJs": false,
     }
   }
   ```

## 🔧 **Creating New Stories**

### **Template for Component Stories:**
```tsx
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ComponentName } from './ComponentName';

export default {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  argTypes: {
    // Define props and controls
  },
} as Meta<typeof ComponentName>;

const Template: Story = (args) => <ComponentName {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Default props
};
```

### **Template for Page Stories:**
```tsx
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { PageComponent } from './PageComponent';

// Mock dependencies
jest.mock('../hooks/useDataManager', () => ({
  useDataManager: () => ({
    data: mockData,
    loading: false,
    error: null,
  }),
}));

export default {
  title: 'Pages/PageName',
  component: PageComponent,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof PageComponent>;

const Template: Story = (args) => <PageComponent {...args} />;

export const Default = Template.bind({});
export const Loading = Template.bind({});
export const Error = Template.bind({});
```

## 📊 **Testing with Storybook**

### **Interactive Testing:**
- Use Storybook controls to modify props
- Test different viewport sizes
- Verify responsive behavior
- Check accessibility features

### **Visual Testing:**
- Compare visual changes between stories
- Test different states (loading, error, empty)
- Verify animations and transitions
- Check color schemes and themes

## 🎯 **Best Practices**

1. **Mock External Dependencies** - Don't rely on real APIs in stories
2. **Use Realistic Data** - Create representative sample data
3. **Test Edge Cases** - Include error states and boundary conditions
4. **Document Props** - Use argTypes to document component props
5. **Responsive Testing** - Test on different viewport sizes
6. **Accessibility** - Include accessibility testing in stories

## 🚨 **Common Issues**

### **Import Errors:**
- Ensure Storybook dependencies are installed
- Check TypeScript configuration
- Verify import paths are correct

### **Component Dependencies:**
- Mock complex dependencies (APIs, contexts, etc.)
- Use decorators for providers
- Create simplified versions for stories

### **Styling Issues:**
- Import CSS/SCSS files in stories
- Use Storybook decorators for global styles
- Check for missing style dependencies

## 📚 **Resources**

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Storybook Addons](https://storybook.js.org/addons/)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)
- [Storybook Testing](https://storybook.js.org/docs/react/writing-tests/introduction)

---

**Status**: ✅ Storybook setup documented
**Next Steps**: Implement Homepage stories following this guide 