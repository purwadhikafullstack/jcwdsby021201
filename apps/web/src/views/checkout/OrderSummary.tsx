import { d } from '@tanstack/react-query-devtools/build/legacy/devtools-PtxSnd7z';
import * as React from 'react';
import { Paper, Typography, Divider, Box, useTheme } from '@mui/material';
import StyledButton from '@/components/button/StyledButton';
import { toThousandFlag } from '@/utils/formatter';
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
  const theme = useTheme();
  return (
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
          Subtotal: Rp {toThousandFlag(subtotal)}
        </Typography>
        <Divider />
        <Typography variant="body1">
          Shipping Cost: Rp {toThousandFlag(shippingCost)}
        </Typography>
        <Divider />
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', marginTop: '10px' }}
        >
          Total: Rp {toThousandFlag(total)}
        </Typography>
      </Box>
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
