import { SxProps, Theme } from '@mui/material/styles';

export const dropzoneContainerStyles: SxProps<Theme> = {
  border: '2px dashed',
  borderColor: (theme) => theme.palette.grey[300],
  backgroundColor: (theme) => theme.palette.grey[100],
  height: 200,
  cursor: 'pointer',
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export const dropzoneThumbStyles: SxProps<Theme> = {
  display: 'inline-flex',
  borderRadius: 1,
  border: '1px solid',
  borderColor: (theme) => theme.palette.grey[300],
  padding: '4px',
  boxSizing: 'border-box',
  position: 'relative',
};
