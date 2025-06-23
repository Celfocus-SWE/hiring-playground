import React from 'react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Add global styles for ProductCard animations
export const decorators = [
  (Story) => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInLoader {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      .modal-open {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return React.createElement(Story);
  },
]; 