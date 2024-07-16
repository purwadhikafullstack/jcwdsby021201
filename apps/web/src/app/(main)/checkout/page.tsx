import * as React from 'react';
import { checkoutMetadata } from '@/app/meta-tag';
import dynamic from 'next/dynamic'
const CheckoutClientComponent = dynamic(() => import('../../../views/checkout/CheckoutClientComponent'), { ssr: false })

interface ICheckoutProps {}

export const metadata = checkoutMetadata;

const Checkout: React.FunctionComponent<ICheckoutProps> = (props) => {
  return <CheckoutClientComponent />;
};

export default Checkout;
