import Link from 'next/link';

import { mainPages } from '@/utils/routes';
import jwt from 'jsonwebtoken';
import TokenExpired from '@/components/error/TokenExpired';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { formWrapperStyles } from '@/styles/authFormStyles';
import React from 'react';
import axiosInstance from '@/utils/axiosInstance';
type Props = {
  params: { token: string };
};

export default async function VerifyPage({ params }: Props) {
  try {
    const token = jwt.verify(
      params.token,
      process.env.JWT_SECRET || 'secret',
    ) as jwt.JwtPayload;
    const res = await axiosInstance.patch('/users/activation-email', {
      token: params.token,
    });
  } catch (error) {
    return <TokenExpired />;
  }

  return (
    <Box component="main" sx={formWrapperStyles}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
        Success!
      </Typography>
      <Box>
        <Typography component="p" variant="body2" sx={{ mb: 1 }}>
          Your email address has been successfully updated and your account is
          now active.
        </Typography>
        <Link href={mainPages.home.path} passHref>
          <Button fullWidth size="large" variant="contained">
            Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
