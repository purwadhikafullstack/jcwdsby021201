import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
import ProductsClientComponent from '@/views/products/ProductsClientComponent';
import { exploreMetadata } from '@/app/meta-tag';
interface IAppProps {}

export const metadata = exploreMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <ProductsClientComponent />;
};

export default App;
