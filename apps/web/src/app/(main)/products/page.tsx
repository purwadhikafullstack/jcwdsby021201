'use client';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
  Box,
  IconButton,
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
import { styled } from '@mui/material/styles';
import StyledButton from '@/components/button/StyledButton';
interface IProductProps {}

const Product: React.FunctionComponent<IProductProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const isAuthenticated = session.status;
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [jumlahTiket, setJumlahTiket] = React.useState(1);

  const { mutateAsync } = useAddToCart();

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

      if (stock < jumlahTiket) {
        errorNotification('Not enough stock available.');
        return;
      }
      if (token) {
        await mutateAsync({
          token,
          data: {
            quantity: jumlahTiket,
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

      console.log(response.data.result.stock);
      return response.data.result.stock;
    } catch (error) {
      console.error('Error checking stock:', error);
      return 0;
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <Container sx={{ my: '120px' }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '30px',
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
                  IDR. {(product.price * jumlahTiket).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <StyledButton
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!isAuthenticated}
                >
                  Add to Cart
                </StyledButton>
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
