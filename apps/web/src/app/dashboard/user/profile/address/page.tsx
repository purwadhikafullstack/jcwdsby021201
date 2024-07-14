import * as React from 'react';
import AddressClientComponent from '@/views/address/AddressClientComponent';
import { addressMetadata } from '@/app/meta-tag';
interface IAddressProps {}

export const metadata = addressMetadata;

const Address: React.FunctionComponent<IAddressProps> = (props) => {
  return <AddressClientComponent />;
};

export default Address;
