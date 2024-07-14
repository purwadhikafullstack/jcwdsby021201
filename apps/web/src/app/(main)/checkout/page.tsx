import * as React from 'react';
import CheckoutClientComponent from '@/views/checkout/CheckoutClientComponent';
import { checkoutMetadata } from '@/app/meta-tag';


interface ICheckoutProps {}

export const metadata = checkoutMetadata;

const Checkout: React.FunctionComponent<ICheckoutProps> = (props) => {
  return <CheckoutClientComponent />;
};

export default Checkout;
