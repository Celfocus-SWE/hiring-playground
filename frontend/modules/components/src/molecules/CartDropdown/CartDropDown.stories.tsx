import React from 'react';
import CartDropDown from './CartDropDown';
import './CartDropDown.module.scss';

export default {
  title: 'Components/CartDropdown',
  component: CartDropDown,
};

export const Default = () => (
  <CartDropDown
    cart={[
      {
        itemId: '12',
        name: 'Product',
        onAddToCart: () => {},
        price: 9.0,
        quantity: 11,
      },
    ]}
  />
);
