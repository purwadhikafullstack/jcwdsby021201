import { createAddressMetadata } from '@/app/meta-tag';
import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
interface IAppProps {}

export const metadata = createAddressMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <AddressForm shouldRedirect={true} />;
};

export default App;
