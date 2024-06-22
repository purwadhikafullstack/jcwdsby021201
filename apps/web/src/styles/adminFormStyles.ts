import { SxProps, Theme } from '@mui/material/styles';

export const adminFormContainerStyles: SxProps<Theme> = {
  p: 4,
  mx: 'auto',
  maxWidth: 'lg',
  border: '1px solid',
  borderRadius: 1,
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

export const adminFormStyles: SxProps<Theme> = {
  mx: 'auto',
  maxWidth: 'sm',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};
