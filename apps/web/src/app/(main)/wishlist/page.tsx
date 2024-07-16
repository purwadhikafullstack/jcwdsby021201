import AddressForm from '@/components/form/AddAddressForm';
import * as React from 'react';
import WishlistClientComponent from '@/views/wishlist/WishlistClientComponent';
import { myWishlistMetadata } from '@/app/meta-tag';
interface IAppProps {}

export const metadata = myWishlistMetadata;

const App: React.FunctionComponent<IAppProps> = (props) => {
  return <WishlistClientComponent />;
};

export default App;
