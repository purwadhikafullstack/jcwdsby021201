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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAddToCart } from '@/features/user/cart/cartMutation';
import { errorFetcherNotification, errorNotification } from '@/utils/notifications';
interface IProductProps {}

const Product: React.FunctionComponent<IProductProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const isAuthenticated = session.status;

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
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`,
      );
      setProducts(response.data.result);
    } catch (error) {
      errorFetcherNotification(error);
    }
  };

  const addToCart = async (productId: number) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          data: {
            quantity: jumlahTiket,
            productId: productId,
          },
        });
      } else {
        errorNotification('Please log in to add items to your cart.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //counter
  const countHarga = (counter: string) => {
    if (counter === '+') {
      return setJumlahTiket((state) => state + 1);
    } else {
      return setJumlahTiket((state) => (state - 1 === 0 ? 1 : state - 1));
    }
  };

  //INI NANTI AJA
  const checkStock = async (productId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/products/stock/${productId}`,
      );

      return response.data.result.stock;
    } catch (error) {
      console.error('Error checking stock:', error);
      return 0;
    }
  };

  return (
    <Container sx={{ my: '120px' }}>
      <Typography variant="h4" gutterBottom>
        Product
      </Typography>
      <Grid container spacing={4}>
        {products.map((product: any) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '450px' }}>
              <CardMedia
                component="img"
                height="200"
                width="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'scale-down' }}
              />
              <Divider />
              <CardContent>
                <Typography variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" component="div">
                  IDR{product.price * jumlahTiket}
                </Typography>
              </CardContent>
              <CardActions>
                <Box display="flex" alignItems="center">
                  <IconButton>
                    <RemoveIcon onClick={() => countHarga('-')} />
                  </IconButton>
                  <Typography>{jumlahTiket}</Typography>
                  <IconButton>
                    <AddIcon onClick={() => countHarga('+')} />
                  </IconButton>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => addToCart(product.id)}
                  disabled={isAuthenticated === 'unauthenticated'}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Product;
