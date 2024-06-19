'use client';
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const BannerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(4, 0),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const BannerContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  color: theme.palette.common.white,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const CountdownItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  borderRadius: '50%',
  padding: theme.spacing(2),
  textAlign: 'center',
  width: '60px',
  height: '60px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Countdown = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        mb: 2,
        [theme.breakpoints.up('md')]: { justifyContent: 'flex-start', mb: 0 },
      }}
    >
      <CountdownItem>
        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          23
        </Typography>
        <Typography variant="caption">Hours</Typography>
      </CountdownItem>
      <CountdownItem>
        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          05
        </Typography>
        <Typography variant="caption">Days</Typography>
      </CountdownItem>
      <CountdownItem>
        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          59
        </Typography>
        <Typography variant="caption">Minutes</Typography>
      </CountdownItem>
      <CountdownItem>
        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          35
        </Typography>
        <Typography variant="caption">Seconds</Typography>
      </CountdownItem>
    </Box>
  );
};

export default function BannerSection() {
  return (
    <BannerContainer>
      <BannerContent>
        <Box sx={{ order: { xs: 2, md: 1 }, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" sx={{ color: '#4caf50' }} gutterBottom>
            Categories
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Enhance Your Music Experience
          </Typography>
          <Countdown />
          <Button variant="contained" color="success" sx={{ mt: 4, width: '150px', fontSize: '16px' }}>
            Buy Now!
          </Button>
        </Box>
        <Box sx={{ order: { xs: 1, md: 2 }, mb: { xs: 2, md: 0 }, textAlign: 'center' }}>
          <Image src="/images/jbl.png" alt="JBL Speaker" width={500} height={300} style={{ width: '100%', height: 'auto' }} />
        </Box>
      </BannerContent>
    </BannerContainer>
  );
}
