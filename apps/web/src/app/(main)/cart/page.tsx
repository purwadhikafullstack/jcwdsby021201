'use client';
import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Alert,
  Box,
  Backdrop,
  CircularProgress,
  useTheme,
} from '@mui/material';
import TableCart from '@/components/table/CartListTable';
import StyledButton from '@/components/button/StyledButton';
import { useCartLogic } from './useCartLogic';
import { toThousandFlag } from '@/utils/formatter';

const Cart = () => {
  const {
    product,
    errorMessage,
    deleteProduct,
    updateQuantity,
    getMaxQuantity,
    calculateTotal,
    handleCheckout,
    isLoading,
  } = useCartLogic();
  const theme = useTheme();

  return (
    <Container sx={{ my: '120px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
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
          <Paper
            style={{ padding: 16 }}
            sx={{
              boxShadow: 'none',
              backgroundColor: '#EEE',
              [theme.breakpoints.down('lg')]: {
                backgroundColor: '#FFF',
              },
            }}
          >
            <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
              Order Summary
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FFF',
                p: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <Typography variant="body1">
                Total : Rp.
                {toThousandFlag(calculateTotal() ?? 0)}
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16 }}
              onClick={handleCheckout}
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
