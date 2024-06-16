import { SxProps, Theme } from '@mui/material/styles';

export const formWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  maxWidth: {
    xs: '400px',
    sm: '440px',
    md: '500px',
  },
  p: { xs: 2, sm: 3, md: 4, xl: 5 },
  margin: { xs: 2.5, md: 3 },
  borderRadius: '10px',
  gap: '20px',
  width: '100%',
};
