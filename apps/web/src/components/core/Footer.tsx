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
  [theme.breakpoints.up('sm')]: {
    paddingRight: theme.spacing(2),
  },
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
        <Grid container spacing={4}>
          <FooterColumn item xs={12} sm={6} md={3}>
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
          <FooterColumn item xs={12} sm={6} md={3}>
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
          <FooterColumn item xs={12} sm={6} md={2}>
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
          <FooterColumn item xs={12} sm={6} md={2}>
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
          <FooterColumn
            item
            xs={12}
            sm={12}
            md={2}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'black' }}>
              Download App
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
                mb: 2,
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  mr: { sm: 2 },
                }}
              >
                <Image
                  src="/images/QrCode.png"
                  alt="QR Code"
                  width={90}
                  height={90}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Link
                  href="#"
                  sx={{ mx: { xs: 1, sm: 0 }, mb: { xs: -1, sm: 1 } }}
                >
                  <Image
                    src="/images/GooglePlay.png"
                    alt="Google Play"
                    width={110}
                    height={35}
                    style={{ marginBottom: '8px', display: 'block' }}
                  />
                </Link>
                <Link
                  href="#"
                  sx={{ mx: { xs: 1, sm: 0 }, mb: { xs: 0, sm: 1 } }}
                >
                  <Image
                    src="/images/AppStore.png"
                    alt="App Store"
                    width={110}
                    height={35}
                    style={{ display: 'block' }}
                  />
                </Link>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' },
                ml: { sm: 2, md: 0 }, // Menambahkan margin kiri untuk selaraskan dengan QR code dan gambar store
              }}
            >
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
