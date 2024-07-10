import BNI from '@/public/icons/bni.png';
import MANDIRI from '@/public/icons/mandiri.webp';
import BCA from '@/public/icons/bca.png';
import BRI from '@/public/icons/bri.png';
import GOPAY from '@/public/icons/GOPAY.png';
import OVO from '@/public/icons/OVO.png';

export const paymentMethods = [
  {
    name: 'Bank Mandiri',
    instructions: [
      'Open the Mandiri Online app',
      'Log in with your username and password',
      'Select the "Transfer" menu',
      'Choose "To Mandiri Account"',
      'Enter the destination account number: 1234567890',
      'Enter the transfer amount',
      'Include your Order Code in the description',
      'Confirm and complete the transaction',
    ],
    icons: MANDIRI,
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
      'Include your Order Code in the description',
      'Confirm and complete the transaction',
    ],
    icons: BCA,
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
      'Include your Order Code in the description',
      'Confirm and complete the transaction',
    ],
    icons: BRI,
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
      'Include your Order Code in the description',
      'Confirm and complete the transaction',
    ],
    icons: BNI,
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
    icons: GOPAY,
  },
  {
    name: 'E-Wallet (OVO)',
    instructions: [
      'Open your OVO app',
      'Select "Transfer"',
      'Choose "To OVO Account"',
      'Enter our OVO number: 0887654321',
      'Enter the total amount',
      'Include your Order Code in the description',
      'Confirm and pay',
    ],
    icons: OVO,
  },
];
