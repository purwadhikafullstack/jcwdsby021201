import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toThousandFlag } from '@/utils/formatter';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
interface ITableCartProps {
  product: any | undefined;
  handleAddToCart: (productId: number) => Promise<void>;
  handleRemove: (productId: number) => Promise<void>;
}

const WishlistTable: React.FunctionComponent<ITableCartProps> = ({
  product,
  handleAddToCart,
  handleRemove,
}: ITableCartProps) => {
  const router = useRouter();

  if (!product || product.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: '40px',
          gap: '20px',
        }}
      >
        <Typography
          variant="caption"
          align="center"
          sx={{ textTransform: 'uppercase', fontSize: '14px' }}
        >
          Wishlist is Empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/products')}
          sx={{
            fontWeight: 'bold',
            padding: '12px 16px',
            fontSize: '14px',
            textTransform: 'uppercase',
            ...buttonPrimaryStyles,
          }}
        >
          Let&#39;s Explore Product
        </Button>
      </Box>
    );
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 'none', overflowX: 'auto' }}
    >
      <Table>
        <TableHead>
          <TableCell></TableCell>
          <TableCell>Product</TableCell>
          <TableCell>Price</TableCell>
          <TableCell align="center">Action</TableCell>
        </TableHead>
        <TableBody>
          {product?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_BASE_API_URL +
                        `${item.productImage}` || `${item.productImage}`
                    }
                    alt={item.productName}
                    width={50}
                    height={50}
                    style={{ marginRight: 10 }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    textTransform: 'uppercase',
                  }}
                >
                  {item.productName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>Rp. {toThousandFlag(item.productPrice)}</Typography>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ width: '140px' }}
                    onClick={() => handleAddToCart(item.productId)}
                    sx={{
                      fontWeight: 'bold',
                      padding: '12px 16px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      ...buttonPrimaryStyles,
                    }}
                  >
                    Add To Cart
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ width: '140px' }}
                    sx={{
                      fontWeight: 'bold',
                      padding: '12px 16px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      ...buttonPrimaryStyles,
                    }}
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WishlistTable;
