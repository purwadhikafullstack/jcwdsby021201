'use client';
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';
import Logo from '@/components/core/Logo';
import Image from 'next/image';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#d9d9d9',
  color: theme.palette.common.black,
  padding: theme.spacing(6, 0),
}));

const FooterColumn = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.black,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SocialIcon = styled(Link)(({ theme }) => ({
  color: theme.palette.common.black,
  marginRight: theme.spacing(2),
}));

const SubscribeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.common.black}`,
  borderRadius: '4px',
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '200px',
  },
}));

const InputEmail = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: 'transparent',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.common.black,
    },
    '& input': {
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        width: '150px',
      },
    },
  },
  '& input': {
    color: theme.palette.common.black,
  },
}));

export default function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <FooterColumn item xs={12} sm={2}>
            <Logo />
            <Typography variant="body1" sx={{ mt: 2, color: 'black' }}>
              Subscribe
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'black', whiteSpace: 'nowrap' }}
            >
              Get 10% off your first order
            </Typography>
            <SubscribeBox>
              <InputEmail
                variant="outlined"
                placeholder="Enter your email"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type="submit"
                      sx={{ p: '10px', color: 'black' }}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </SubscribeBox>
          </FooterColumn>
          <FooterColumn item xs={12} sm={2}>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Support
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              exclusive@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              +88015-88888-9999
            </Typography>
          </FooterColumn>
          <FooterColumn item xs={12} sm={2}>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Account
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">My Account</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Login / Register</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Cart</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Wishlist</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Shop</FooterLink>
            </Typography>
          </FooterColumn>
          <FooterColumn item xs={12} sm={2}>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Quick Link
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Privacy Policy</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Terms of Use</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">FAQ</FooterLink>
            </Typography>
            <Typography variant="body2">
              <FooterLink href="#">Contact</FooterLink>
            </Typography>
          </FooterColumn>
          <FooterColumn item xs={12} sm={3}>
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Download App
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Image src="/QrCode.png" alt="QR Code" width={90} height={90} />
              <Box sx={{ ml: 2 }}>
                <Link href="#">
                  <Image
                    src="/GooglePlay.png"
                    alt="Google Play"
                    width={110}
                    height={35}
                    style={{ marginBottom: '8px' }}
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/AppStore.png"
                    alt="App Store"
                    width={110}
                    height={35}
                  />
                </Link>
              </Box>
            </Box>
            <Box>
              <SocialIcon href="#">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon href="#">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href="#">
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </FooterColumn>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body2" align="center" sx={{ color: 'black' }}>
            &copy; Copyright Rimel 2022. All right reserved
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
}
