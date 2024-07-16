import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
import ProfileClientComponent from '@/views/profile/ProfileClientComponent';
import { profileMetadata } from '@/app/meta-tag';
interface IAppProps {}

export const metadata = profileMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <ProfileClientComponent />;
};

export default App;
