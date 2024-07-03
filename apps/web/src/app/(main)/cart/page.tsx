'use client';
import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import {
  useDeleteProduct,
  useUpdateQuantity,
} from '@/features/user/cart/cartMutation';
import { useGetProductCart } from '@/features/user/cart/cartQueries';
import { useRouter } from 'next/navigation';
import { ProductBody } from '@/features/user/cart/type';
import TableCart from '@/components/table/CartListTable';
import { checkStock } from '@/features/user/cart/cartFecther';
import { errorFetcherNotification } from '@/utils/notifications';

const Cart = () => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //state object sebagai patokan productId dan stocknya
  const [productStocks, setProductStocks] = React.useState<{
    [key: number]: number;
  }>({});

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { mutateAsync } = useDeleteProduct();
  const { mutateAsync: updateQuantityProduct } = useUpdateQuantity();
  const { data: product } = useGetProductCart(token || '');

  //Handle Delete
  const deleteProduct = async (productId: number) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          productId: productId,
        });
      }
    } catch (error) {
      errorFetcherNotification(error)
    }
  };

  //Handle Update
  const updateQuantity = async (productId: number, newQuantity: number) => {
    try {
      if (token) {
        await updateQuantityProduct({
          token,
          data: {
            productId: Number(productId),
            quantity: newQuantity,
          },
        });
      }
    } catch (error) {
      errorFetcherNotification(error)
    }
  };

  //jumlah stock di seluruh gudang
  React.useEffect(() => {
    if (product) {
      product.forEach(async (item: ProductBody) => {
        const stock = await checkStock(item.productId);
        setProductStocks((prev) => {
          const newState = { ...prev, [item.productId]: stock };
          return newState;
        });
      });
    }
  }, [product]);

  const getMaxQuantity = (item: any) => {
    const stockQuantity = productStocks[item.productId] || 0;
    return stockQuantity;
  };

  //CheckSTock before checkout:
  const checkStockBeforeCheckout = async () => {
    if (!product || product.length === 0) {
      setErrorMessage(
        'Your cart is empty. Please add products before checkout.',
      );
      return false;
    }

    let insufficientStock = false;
    let errorMsg = 'Insufficient stock for: ';

    for (const item of product) {
      const availableStock = productStocks[item.productId] || 0;
      if (item.quantity > availableStock) {
        insufficientStock = true;
        errorMsg += `${item.name}, `;
      }
    }

    if (insufficientStock) {
      setErrorMessage(errorMsg.slice(0, -2));
      //buatin supaya dia ga lanjut
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const calculateTotal = () => {    
    return product?.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    const stockOk = await checkStockBeforeCheckout();
    if (stockOk) {
      router.push('/checkout');
    }
  };

  return (
    <Container sx={{ my: '120px' }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableCart
            product={product}
            updateQuantity={updateQuantity}
            deleteProduct={deleteProduct}
            getMaxQuantity={getMaxQuantity}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Order Summary</Typography>
            <Typography variant="body1">Total : {calculateTotal()?.toLocaleString()}</Typography>
            <Button
              onClick={handleCheckout}
              variant="contained"
              color="inherit"
              fullWidth
              style={{ marginTop: 16 }}
            >
              Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
