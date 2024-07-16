import React from 'react';

import Box from '@mui/material/Box';
import Logo from '@/components/core/Logo';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box sx={{ pl: 3, pt: 3 }} component="header">
        <Logo />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 66px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
