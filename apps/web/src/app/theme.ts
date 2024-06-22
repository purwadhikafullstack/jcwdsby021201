'use client';

import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: blue[500] },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
