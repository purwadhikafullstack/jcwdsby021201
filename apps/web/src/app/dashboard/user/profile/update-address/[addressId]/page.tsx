import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
import UpdateAddressClientComponent from '@/views/address/UpdateAddressClientComponent';
import { updateAddressMetadata } from '@/app/meta-tag';
interface IAppProps {}

export const metadata = updateAddressMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <UpdateAddressClientComponent />;
};

export default App;
