import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useGetDetailOrder } from '@/features/user/order/orderQueries';
import { toThousandFlag } from '@/utils/formatter';

interface IDetailOrderModalProps {
  open: boolean;
  handleClose: () => void;
  orderId: string;
  token: string;
}

const DetailOrderModal: React.FunctionComponent<IDetailOrderModalProps> = ({
  open,
  handleClose,
  orderId,
  token,
}) => {
  const { data } = useGetDetailOrder(token, orderId);

  const formatRupiah = (amount: number) => `Rp. ${toThousandFlag(amount)}`;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: '#EEEEEE',
          boxShadow: 'none',
          textTransform: 'uppercase',
        }}
      >
        Order Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black',
            border: '2px solid black',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#EEEEEE', boxShadow: 'none' }}>
        {data && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
                  Order Information
                </Typography>
                <Divider />
                <Typography>Order ID: {data.name}</Typography>
                <Typography>
                  Address:{' '}
                  <Typography
                    component="span"
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    {data.shippingAddress}
                  </Typography>
                </Typography>
                <Typography>
                  Recipient:{' '}
                  <Typography
                    component="span"
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    {data.username}
                  </Typography>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
                  Order Products
                </Typography>
                <Divider />

                {data.orderProducts.map((item, index) => (
                  <Grid
                    container
                    key={index}
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Grid item>
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_BASE_API_URL + item.imageUrl
                        }
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        Price: {formatRupiah(item.price * item.quantity)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  Total: {formatRupiah(data.total)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailOrderModal;
