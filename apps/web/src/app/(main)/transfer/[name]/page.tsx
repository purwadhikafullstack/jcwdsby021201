import * as React from 'react';
import TransferClientComponent from '@/views/transfer/TransferClientComponent';
import { transferMetadata } from '@/app/meta-tag';

interface IPaymentProps {}
export const metadata = transferMetadata;

const Payment: React.FunctionComponent<IPaymentProps> = (props) => {
  return <TransferClientComponent />;
};

export default Payment;
