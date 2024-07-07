'use client';

import { useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PaymentInstructions = () => {
  const router = useRouter();
  const paymentMethods = [
    {
      name: 'Bank Mandiri',
      instructions: [
        'Open the Mandiri Online app',
        'Log in with your username and password',
        'Select the "Transfer" menu',
        'Choose "To Mandiri Account"',
        'Enter the destination account number: 1234567890',
        'Enter the transfer amount',
        'Confirm and complete the transaction',
      ],
    },
    {
      name: 'Bank BCA',
      instructions: [
        'Open the BCA Mobile app',
        'Log in with your access code',
        'Select the "m-Transfer" menu',
        'Choose "Transfer" and then "BCA Virtual Account"',
        'Enter the virtual account number: 1234567890123456',
        'Enter the transfer amount',
        'Confirm and complete the transaction',
      ],
    },
    {
      name: 'Bank BRI',
      instructions: [
        'Open the BRImo app',
        'Log in with your username and password',
        'Select the "Transfer" menu',
        'Choose "To BRI Account"',
        'Enter the destination account number: 0987654321',
        'Enter the transfer amount',
        'Confirm and complete the transaction',
      ],
    },
    {
      name: 'Bank BNI',
      instructions: [
        'Open the BNI Mobile Banking app',
        'Log in with your username and MPIN',
        'Select the "Transfer" menu',
        'Choose "To BNI Account"',
        'Enter the destination account number: 5678901234',
        'Enter the transfer amount',
        'Confirm and complete the transaction',
      ],
    },
    {
      name: 'E-Wallet (GoPay)',
      instructions: [
        'Open your GoPay app',
        'Select "Pay" or "Transfer"',
        'Enter our GoPay number: 0812345678',
        'Enter the total amount',
        'Include your Order ID in the description',
        'Confirm and pay',
      ],
    },
    {
      name: 'E-Wallet (OVO)',
      instructions: [
        'Open your OVO app',
        'Select "Transfer"',
        'Choose "To OVO Account"',
        'Enter our OVO number: 0887654321',
        'Enter the total amount',
        'Include your Order ID in the description',
        'Confirm and pay',
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment Instructions
        </Typography>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            General Instructions
          </Typography>
          <Typography>
            1. Choose your preferred payment method from the options below.
          </Typography>
          <Typography>
            2. Follow the specific instructions for your chosen method.
          </Typography>
          <Typography>
            3. Make sure to include your Order ID in the payment description.
          </Typography>
          <Typography>
            4. Complete the payment within 24 hours of placing your order.
          </Typography>
          <Typography>
            5. After payment, go to your order details page and upload the proof
            of payment.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Payment Methods
          </Typography>
          {paymentMethods.map((method, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{method.name}</Typography>
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
          <Typography variant="h5" gutterBottom>
            After Payment
          </Typography>
          <Typography>
            After completing your payment, please go to your order details page
            and upload the proof of payment. Our team will verify the payment
            and process your order as soon as possible.
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          sx={{
            color: 'white',
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
          onClick={() => router.push('/dashboard/user/order/to-pay')}
        >
          Go To Order Page
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentInstructions;
