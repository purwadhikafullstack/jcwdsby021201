'use client';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { UserSession } from '@/features/types';
import { useSession } from 'next-auth/react';
import AddToCartConfirmation from '@/components/dialog/AddToCartOption';
import { useAddToCart } from '@/features/user/cart/cartMutation';
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import { useRouter } from 'next/navigation';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import {
  useAddWishlist,
  useRemoveWishlist,
} from '@/features/user/wishlist/wishlistMutation';
import { useGetWishlistData } from '@/features/user/wishlist/wishlistQueries';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
interface IProductProps {}

const Product: React.FunctionComponent<IProductProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const isAuthenticated = session.status;
  const verif = user?.isVerified;

  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [qty, setQty] = React.useState(1);

  const { mutateAsync } = useAddToCart();
  const { mutateAsync: AddWishlistMutateAsync } = useAddWishlist();
  const { mutateAsync: RemoveWishlistMutateAsync } = useRemoveWishlist();
  React.useEffect(() => {
    getProduct();
  }, []);

  //getProducts
  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/products/display`,
      );
      setProducts(response.data.result);
    } catch (error) {
      errorFetcherNotification(error);
      console.log(error);
    }
  };

  //handle modal:
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleAddToCart = async (productId: number) => {
    try {
      const stock = await checkStock(productId);

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
      console.error(error);
    }
  };

  //CHECK STOCK
  const checkStock = async (productId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/products/stock/${productId}`,
      );

      return response.data.result.stock;
    } catch (error) {
      console.error('Error checking stock:', error);
      return 0;
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
      <Grid container spacing={4}>
        {products.map((product: any) => (
          <Grid item key={product.id} xs={12} sm={6} md={2.4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                border: 'none',
                position: 'relative',
              }}
            >
              <Box>
                <CardMedia
                  component="img"
                  height="200"
                  width="100"
                  image={
                    process.env.NEXT_PUBLIC_BASE_API_URL + product.pictures
                  }
                  alt={product.name}
                  sx={{ objectFit: 'contain' }}
                />
                <IconButton
                  onClick={() => toggleWishlist(product.id)}
                  disabled={
                    isAuthenticated === 'unauthenticated' || verif === false
                  }
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: isProductInWishlist(product.id) ? 'red' : 'black',
                  }}
                >
                  {isProductInWishlist(product.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{
                        color: 'black',
                      }}
                    />
                  )}
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitLineClamp: 1,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    fontSize: '12px',
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                >
                  IDR. {(product.price * qty).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  sx={{
                    fontWeight: 'bold',
                    padding: '12px 16px',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    width: '100%',
                    ...buttonPrimaryStyles,
                  }}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={
                    isAuthenticated === 'unauthenticated' || verif === false
                  }
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
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
