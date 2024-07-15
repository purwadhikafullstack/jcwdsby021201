import * as React from 'react';
import {
  Paper,
  Typography,
  Divider,
  Box,
  useTheme,
  Button,
} from '@mui/material';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
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
      <Button
        fullWidth
        style={{ marginTop: 16 }}
        onClick={onCheckout}
        sx={{ p: 2, ...buttonPrimaryStyles }}
      >
        Make Order
      </Button>
    </Paper>
  );
};

export default OrderSummary;
