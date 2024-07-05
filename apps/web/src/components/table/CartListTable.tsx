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
  TextField,
} from '@mui/material';
import { ProductBody } from '@/features/user/cart/type';
import Image from 'next/image';
import StyledButton from '../button/StyledButton';
interface ITableCartProps {
  product: ProductBody[] | undefined;
  updateQuantity: (productId: number, newQuantity: number) => void;
  deleteProduct: (productId: number) => void;
  getMaxQuantity: (item: ProductBody) => number;
}

const TableCart: React.FunctionComponent<ITableCartProps> = ({
  product,
  updateQuantity,
  deleteProduct,
  getMaxQuantity,
}) => {
  const handleQuantityChange = (item: ProductBody, newValue: string) => {
    const newQuantity = parseInt(newValue, 10);
    if (
      !isNaN(newQuantity) &&
      newQuantity > 0 &&
      newQuantity <= getMaxQuantity(item)
    ) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  if (!product || product.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: '40px',
        }}
      >
        <Typography variant="h6" align="center">
          Cart is Empty
        </Typography>
        <StyledButton>Let's Explore Product</StyledButton>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
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
              <TableCell>IDR. {item.price.toLocaleString()}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                  inputProps={{
                    min: 1,
                    max: getMaxQuantity(item),
                    step: 1,
                  }}
                  size="small"
                  style={{ width: '60px' }}
                />
                <Typography variant="caption" display="block">
                  Max: {getMaxQuantity(item)}
                </Typography>
              </TableCell>
              <TableCell>
                IDR.{(item.price * item.quantity).toLocaleString()}
              </TableCell>
              <TableCell>
                <StyledButton
                  variant="contained"
                  color="error"
                  onClick={() => deleteProduct(item.productId)}
                >
                  Remove
                </StyledButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableCart;
