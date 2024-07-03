'use client';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetOrders } from '@/features/user/order/orderQueries';
import { useCancelOrder } from '@/features/user/order/orderMutation';
import PaymentProofModal from '@/components/modal/PaymentProofModal';
interface IMyOrderProps {}

const MyOrder: React.FunctionComponent<IMyOrderProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const [paymentProofModal, setPaymentProofModal] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);

  const { data: products } = useGetOrders(token || '');
  const { mutateAsync } = useCancelOrder();

  const calculateTotalQuantity = (orderProducts: any) => {
    return orderProducts.reduce(
      (total: any, product: any) => total + product.quantity,
      0,
    );
  };

  const cancelOrder = async (orderId: string) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          orderId,
        });
      }
    } catch (error) {}
  };

  const handleOpenPaymentProofModal = (orderId: any) => {
    setSelectedOrderId(orderId);
    setPaymentProofModal(true);
  };
  const handleClosePaymentProofModal = () => {
    setPaymentProofModal(false);
    setSelectedOrderId(null);
  };

  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Typography variant="h6" align="center">
          You haven't placed any orders yet
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Let's Explore Product
        </Button>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <img
                    src={
                      process.env.NEXT_PUBLIC_BASE_API_URL +
                        `${item.orderProducts[0].product.picture}` ||
                      `${item.image}`
                    }
                    alt={item.orderProducts[0].product.name}
                    width={50}
                    height={50}
                    style={{ marginRight: 10 }}
                  />
                  <Box>
                    {item.orderProducts.map((product: any, index: number) => (
                      <Typography key={index} variant="body2">
                        {product.product.name}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography>
                  {calculateTotalQuantity(item.orderProducts)}
                </Typography>
              </TableCell>
              <TableCell>IDR. {item.total.toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => handleOpenPaymentProofModal(item.id)}
                >
                  Payment Proof
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => cancelOrder(item.id)}
                >
                  Cancel Order
                </Button>
                <PaymentProofModal
                  handleClose={handleClosePaymentProofModal}
                  open={paymentProofModal}
                  orderId={item.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyOrder;
