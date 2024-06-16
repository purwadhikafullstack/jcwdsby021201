'use client';
import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const BannerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(4, 0),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const BannerContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  color: theme.palette.common.white,
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

const Countdown = () => (
  <Box sx={{ display: 'flex', gap: 2 }}>
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

export default function BannerSection() {
  return (
    <BannerContainer>
      <BannerContent>
        <Box>
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
        <Box>
          <Image src="/images/jbl.png" alt="JBL Speaker" width={500} height={300} />
        </Box>
      </BannerContent>
    </BannerContainer>
  );
}
