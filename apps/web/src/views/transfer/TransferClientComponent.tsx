'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';
import PaymentProofModal from '@/components/modal/PaymentProofModal';
import { paymentMethods } from './paymentList';

const PaymentInstructions = () => {
  const id = useParams();
  const router = useRouter();
  const orderLink = id.name as string;
  const orderId = orderLink.split('-')[4].slice(7);
  const orderName = orderLink.slice(0, 24);

  const [paymentProofModal, setPaymentProofModal] = useState(false);
  const handleOpenPaymentProofModal = () => {
    setPaymentProofModal(true);
  };
  const handleClosePaymentProofModal = () => {
    setPaymentProofModal(false);
  };
  return (
    <Container
      maxWidth="md"
      sx={{
        my: 4,
        boxShadow: 'none',
        p: '30px',
      }}
    >
      <Button
        fullWidth
        variant="outlined"
        sx={{
          p: 2,
          color: 'white',
          backgroundColor: 'black',
          borderRadius: '0',
          borderColor: 'black',
          '&:hover': {
            backgroundColor: '#333333',
            color: 'white',
          },
        }}
        onClick={handleOpenPaymentProofModal}
      >
        Payment Proof Upload
      </Button>
      <Box my={2} textAlign="center">
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            backgroundColor: 'black',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            border: '1px solid black',
            p: 2,
          }}
        >
          {' '}
          ORDER CODE
        </Typography>
        <Typography
          variant="h5"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            border: '1px solid black',
            p: 5,
          }}
        >
          {' '}
          {orderName}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
      >
        Payment Instructions
      </Typography>

      <Box my={4}>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ textTransform: 'uppercase', fontWeight: '600' }}
        >
          General Instructions
        </Typography>
        <Typography>
          1. Choose your preferred payment method from the options below.
        </Typography>
        <Typography>
          2. Follow the specific instructions for your chosen method.
        </Typography>
        <Typography>
          3. Complete the payment within 24 hours of placing your order. Ensure
          you write the Order Code in the payment description.
        </Typography>
        <Typography>
          4. After payment, go to your order details page and upload the proof
          of payment.
        </Typography>
      </Box>

      <Box my={4}>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ textTransform: 'uppercase', fontWeight: '600' }}
        >
          Payment Methods
        </Typography>
        {paymentMethods.map((method, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <Image
                  src={method.icons}
                  alt={`${method.name} icon`}
                  width={68}
                  height={20}
                  style={{ marginRight: '28px' }}
                />
                <Typography variant="h6">{method.name}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <ol>
                {method.instructions.map((instruction, idx) => (
                  <li key={idx}>
                    <Typography>{instruction}</Typography>
                  </li>
                ))}
              </ol>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box my={4}>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ textTransform: 'uppercase', fontWeight: '600' }}
        >
          After Payment
        </Typography>
        <Typography>
          After completing your payment, please upload the proof of payment. Our
          team will verify the payment and process your order as soon as
          possible.
        </Typography>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{
          p: 2,
          color: 'white',
          backgroundColor: 'black',
          borderRadius: '0',
          borderColor: 'black',
          '&:hover': {
            backgroundColor: '#333333',
            color: 'white',
          },
        }}
        onClick={() => router.push('/dashboard/user/order/to-pay')}
      >
        Go To Order Page
      </Button>
      <PaymentProofModal
        handleClose={handleClosePaymentProofModal}
        open={paymentProofModal}
        orderId={Number(orderId)}
      />
    </Container>
  );
};

export default PaymentInstructions;
