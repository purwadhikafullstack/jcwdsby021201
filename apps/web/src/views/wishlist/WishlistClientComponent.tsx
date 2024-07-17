'use client';
import * as React from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetWishlistData } from '@/features/user/wishlist/wishlistQueries';
import WishlistTable from '@/components/table/WishlistTable';
import axios from 'axios';
import { errorNotification } from '@/utils/notifications';
import { useAddToCart } from '@/features/user/cart/cartMutation';
import { useRemoveWishlist } from '@/features/user/wishlist/wishlistMutation';
import AddToCartConfirmation from '@/components/dialog/AddToCartOption';
import { useRouter } from 'next/navigation';
import { getStock } from '@/features/user/products/productFetcher';

interface IWishListProps {}

const WishList: React.FunctionComponent<IWishListProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const router = useRouter();

  const { data } = useGetWishlistData(token || '');

  const [quantity, setQuantity] = React.useState(1);
  const [openDialog, setOpenDialog] = React.useState(false);

  const { mutateAsync } = useAddToCart();
  const { mutateAsync: removeMutateAsync } = useRemoveWishlist();

  const goToCart = () => {
    router.push('/cart');
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const stock = await getStock(productId);
      if (stock < quantity) {
        errorNotification('Not enough stock available.');
        return;
      }
      if (token) {
        await mutateAsync({
          token,
          data: {
            quantity: quantity,
            productId: productId,
          },
        });
        setOpenDialog(true);
      } else {
        errorNotification('Please log in to add items to your cart.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Remove Wishlist:
  const removeWishlist = async (productId: number) => {
    try {
      if (token) {
        await removeMutateAsync({
          token,
          productId,
        });
      } else {
        errorNotification('Please log in to remove items to your wishlist');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container sx={{ my: '120px' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        My Wishlist
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <WishlistTable
            product={data}
            handleAddToCart={handleAddToCart}
            handleRemove={removeWishlist}
          />
        </Grid>
      </Grid>
      <AddToCartConfirmation
        goToCart={goToCart}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Container>
  );
};

export default WishList;
