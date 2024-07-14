import { SxProps, Theme } from '@mui/material/styles';

export const buttonPrimaryStyles: SxProps<Theme> = {
  color: 'white',
  backgroundColor: 'black',
  borderColor: 'black',
  '&:hover': {
    backgroundColor: '#333333',
    color: 'white',
  },
};

export const buttonBackStyles: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.grey[500],
  color: 'white',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.grey[600],
  },
};
