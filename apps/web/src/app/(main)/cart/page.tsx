'use client';
import React from 'react';
import { Container, Grid, Typography, Paper, Alert } from '@mui/material';
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
import StyledButton from '@/components/button/StyledButton';
import { useCartLogic } from './useCartLogic';

const Cart = () => {
  const {
    product,
    errorMessage,
    deleteProduct,
    updateQuantity,
    getMaxQuantity,
    calculateTotal,
    handleCheckout,
  } = useCartLogic();

  return (
    <Container sx={{ my: '120px' }}>
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'uppercase' }}>
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
            <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
              Order Summary
            </Typography>
            <Typography variant="body1">
              Total : {calculateTotal()?.toLocaleString()}
            </Typography>
            <StyledButton
              onClick={handleCheckout}
              variant="contained"
              color="inherit"
              fullWidth
              style={{ marginTop: 16 }}
            >
              Checkout
            </StyledButton>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
