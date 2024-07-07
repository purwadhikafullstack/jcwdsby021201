import { d } from '@tanstack/react-query-devtools/build/legacy/devtools-PtxSnd7z';
import * as React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import StyledButton from '@/components/button/StyledButton';
interface IOrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  onCheckout: () => void;
}

const OrderSummary: React.FunctionComponent<IOrderSummaryProps> = ({
  subtotal,
  shippingCost,
  onCheckout,
}: IOrderSummaryProps) => {
  const total = subtotal + shippingCost;
  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        Order Summary
      </Typography>
      <Typography variant="body1">
        Subtotal: Rp {subtotal.toLocaleString()}
      </Typography>
      <Typography variant="body1">
        Shipping Cost: Rp {shippingCost.toLocaleString()}
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Total: Rp {total.toLocaleString()}
      </Typography>
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 16 }}
        onClick={onCheckout}
      >
        Make Order
      </StyledButton>
    </Paper>
  );
};

export default OrderSummary;
