import * as React from 'react';
import { Typography, Paper, Box, Button, useTheme } from '@mui/material';
import { toThousandFlag } from '@/utils/formatter';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
interface IOrderSummaryCartProps {
  calculateTotal: () => number | undefined;
  handleCheckout: () => void;
}

const OrderSummaryCart: React.FunctionComponent<IOrderSummaryCartProps> = ({
  calculateTotal,
  handleCheckout,
}: IOrderSummaryCartProps) => {
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
          Total : Rp.
          {toThousandFlag(calculateTotal() ?? 0)}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 16 }}
        sx={{ p: 2, ...buttonPrimaryStyles }}
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </Paper>
  );
};

export default OrderSummaryCart;
