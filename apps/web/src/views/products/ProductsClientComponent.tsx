'use client';

import * as React from 'react';

//MAterial UI
import { Container, Grid, Typography } from '@mui/material';

//AUTH
import { UserSession } from '@/features/types';
import { useSession } from 'next-auth/react';

//FETCHER QUERIES
import {
  useAddWishlist,
  useRemoveWishlist,
} from '@/features/user/wishlist/wishlistMutation';
import { getProducts, getStock } from '@/features/user/products/productFetcher';
import { ProductBody } from '@/features/user/products/type';
import { useGetWishlistData } from '@/features/user/wishlist/wishlistQueries';

//OTHER
import AddToCartConfirmation from '@/components/dialog/AddToCartOption';
import { useAddToCart } from '@/features/user/cart/cartMutation';
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';

interface IProductProps {}

const Product: React.FunctionComponent<IProductProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const isAuthenticated = session.status;
  const verif = user?.isVerified;

  const router = useRouter();
  const [products, setProducts] = React.useState<ProductBody[]>([]);
  const [qty, setQty] = React.useState(1);

  const { mutateAsync } = useAddToCart();
  const { mutateAsync: AddWishlistMutateAsync } = useAddWishlist();
  const { mutateAsync: RemoveWishlistMutateAsync } = useRemoveWishlist();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      const stock = await getStock(1);
      console.log(stock);

      setProducts(result);
    } catch (error) {
      errorFetcherNotification(error);
      console.log(error);
    }
  };

  //handle modal:
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleAddToCart = async (productId: number) => {
    try {
      const stock = await getStock(productId);

      if (stock < qty) {
        errorNotification('Not enough stock available.');
        return;
      }
      if (token) {
        await mutateAsync({
          token,
          data: {
            quantity: qty,
            productId: productId,
          },
        });
        setOpenDialog(true);
      } else {
        errorNotification('Please log in to add items to your cart.');
      }
    } catch (error) {
      errorFetcherNotification(error);
      console.error(error);
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  //handle wishlist
  const toggleWishlist = async (productId: number) => {
    try {
      if (token) {
        if (isProductInWishlist(productId)) {
          await RemoveWishlistMutateAsync({
            token,
            productId,
          });
        } else {
          await AddWishlistMutateAsync({
            token,
            productId,
          });
        }
      } else {
        errorNotification('Please log in to manage your wishlist');
      }
    } catch (error) {
      console.error(error);
      errorNotification('Failed to update wishlist');
    }
  };

  //data wishlist
  const { data: wishlistData } = useGetWishlistData(token || '');

  const isProductInWishlist = (productId: number) => {
    if (!wishlistData) return false;
    for (let item of wishlistData) {
      if (item.productId === productId) {
        return true;
      }
    }
    return false;
  };

  return (
    <Container sx={{ my: '120px' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          mb: 5,
        }}
      >
        Product
      </Typography>
      <Grid container spacing={1}>
        {products.map((product: any) => (
          <Grid item key={product.id} xs={6} sm={3} md={2.4}>
            <ProductCard
              product={product}
              qty={qty}
              isAuthenticated={isAuthenticated}
              verif={verif}
              isProductInWishlist={isProductInWishlist}
              toggleWishlist={toggleWishlist}
              handleAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>
      <AddToCartConfirmation
        goToCart={goToCart}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Container>
  );
};

export default Product;
