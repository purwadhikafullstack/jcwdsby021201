import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <AddressForm shouldRedirect={true} />;
};

export default App;
