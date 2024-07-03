'use client';

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

import { UserSession } from '@/features/types';
import { useGetShippedOrders } from '@/features/user/order/orderQueries';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useReceiveOrder } from '@/features/user/order/orderMutation';

interface IOrderShippedProps {}
const OrderShipped: React.FunctionComponent<IOrderShippedProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { data: products } = useGetShippedOrders(token || '');
  const calculateTotalQuantity = (orderProducts: any) => {
    return orderProducts.reduce(
      (total: any, product: any) => total + product.quantity,
      0,
    );
  };
  const { mutateAsync } = useReceiveOrder();
  const receiveOrder = async (orderId: string) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          orderId,
        });
      }
    } catch (error) {}
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
          Your order is still being processed by the admin, please wait
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
                  color="success"
                  onClick={() => receiveOrder(item.id)}
                >
                  Order Received
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderShipped;
