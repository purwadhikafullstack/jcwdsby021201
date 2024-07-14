'use client';
import CheckoutTable from '@/components/table/CheckoutTable';
import AddressAndPaymentSelection from '@/views/checkout/AddressAndPaymentSelection';
import CourierSelection from '@/views/checkout/CourierSelection';
import OrderSummary from '@/views/checkout/OrderSummary';
import {
  Container,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import * as React from 'react';
import { useCheckoutLogic } from './checkoutLogic';

interface ICheckoutProps {}

const Checkout: React.FunctionComponent<ICheckoutProps> = (props) => {
  const {
    selectedAddressId,
    shippingCost,
    paymentMethod,
    courier,
    errorMessage,
    showAddressForm,
    product,
    dataAddress,
    setPaymentMethod,
    setCourier,
    setShowAddressForm,
    refreshAddresses,
    handleAddressChange,
    calculateTotal,
    handleCheckout,
  } = useCheckoutLogic();

  return (
    <Container sx={{ my: '120px' }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutTable product={product} />
          <AddressAndPaymentSelection
            selectedAddressId={selectedAddressId}
            paymentMethod={paymentMethod}
            dataAddress={dataAddress}
            handleAddressChange={handleAddressChange}
            setPaymentMethod={setPaymentMethod}
            setShowAddressForm={setShowAddressForm}
            refreshAddresses={refreshAddresses}
            showAddressForm={showAddressForm}
          />
          <CourierSelection courier={courier} setCourier={setCourier} />
        </Grid>
        <Grid item xs={12} md={4} sx={{ backgroundColor: 'eee' }}>
          <OrderSummary
            subtotal={calculateTotal() || 0}
            shippingCost={shippingCost}
            onCheckout={handleCheckout}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
