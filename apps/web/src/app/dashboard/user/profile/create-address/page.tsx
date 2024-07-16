import * as React from 'react';
import { createAddressMetadata } from '@/app/meta-tag';
import dynamic from 'next/dynamic'
const AddressForm = dynamic(() => import('../../../../../components/form/AddAddressForm'), { ssr: false });

interface IAppProps {}

export const metadata = createAddressMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <AddressForm shouldRedirect={true} />;
};

export default App;
