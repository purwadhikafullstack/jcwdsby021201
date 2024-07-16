import * as React from 'react';
import CardClientComponent from '@/views/cart/CartClientComponent';
import { cartMetadata } from '@/app/meta-tag';

interface ICartProps {}

export const metadata = cartMetadata;

const Cart: React.FunctionComponent<ICartProps> = (props) => {
  return <CardClientComponent />;
};

export default Cart;
