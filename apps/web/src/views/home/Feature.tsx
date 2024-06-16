'use client';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
  {
    name: 'PlayStation 5',
    description: 'Incredible games & non-stop entertainment',
    image: '/images/ps5.png',
  },
  {
    name: 'Laptop',
    description: 'Laptop collections that suit your passion and lifestyle',
    image: '/images/laptop.png',
  },
  {
    name: 'Headset',
    description: 'Headset collections that give you another vibe',
    image: '/images/headset.png',
  },
  {
    name: 'Speaker',
    description: 'Amazing wireless speakers',
    image: '/images/speaker.webp',
  },
];

export default function FeatureSection() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Box bgcolor="error.main" width={10} height={30} mr={1} borderRadius="3px" />
        <Typography variant="h6" color="error">
          Featured
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          New Arrival
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box position="relative" bgcolor="black">
            <Image src={features[0].image} alt={features[0].name} width={500} height={500} />
            <Box position="absolute" bottom={0} left={0} p={2} color="white">
              <Typography variant="h4" gutterBottom>
                {features[0].name}
              </Typography>
              <Typography variant="body1" paragraph>
                {features[0].description}
              </Typography>
              <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                Shop Now
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" bgcolor="black">
                <Box p={2} color="white">
                  <Typography variant="h4" gutterBottom>
                    {features[1].name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {features[1].description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                    Shop Now
                  </Typography>
                </Box>
                <Image src={features[1].image} alt={features[1].name} width={450} height={200} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box position="relative" bgcolor="black">
                <Image src={features[2].image} alt={features[2].name} width={250} height={250} />
                <Box position="absolute" bottom={0} left={0} p={2} color="white">
                  <Typography variant="h6" gutterBottom>
                    {features[2].name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {features[2].description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                    Shop Now
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box position="relative" bgcolor="black">
                <Image src={features[3].image} alt={features[3].name} width={250} height={250} />
                <Box position="absolute" bottom={0} left={0} p={2} color="white">
                  <Typography variant="h6" gutterBottom>
                    {features[3].name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {features[3].description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
                    Shop Now
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 8 }}>
        <Grid item xs={12} sm={4} textAlign="center">
          <LocalShippingIcon fontSize="large" />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            FREE AND FAST DELIVERY
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Free delivery for all orders over $140
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
          <SupportAgentIcon fontSize="large" />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            24/7 CUSTOMER SERVICE
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Friendly 24/7 customer support
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign="center">
          <SecurityIcon fontSize="large" />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            MONEY BACK GUARANTEE
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We return money within 30 days
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}