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
  Select,
  MenuItem,
} from '@mui/material';
import { ProductBody } from '@/features/user/cart/type';
import Image from 'next/image';
interface ICheckoutTableProps {
  product: ProductBody[] | undefined;
}

const CheckoutTable: React.FunctionComponent<ICheckoutTableProps> = ({
  product,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {product?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_BASE_API_URL + `${item.image}` ||
                      `${item.image}`
                    }
                    alt={item.name}
                    width={50}
                    height={50}
                    style={{ marginRight: 10 }}
                  />
                  <Typography
                    sx={{
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>Rp {item.price.toLocaleString()}</TableCell>
              <TableCell>
                Rp {(item.quantity * item.price).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CheckoutTable;
