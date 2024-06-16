import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import Image from 'next/image';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 8 }}>
      <Grid container spacing={4} alignItems="center" sx={{ mb: 14 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
          </Typography>
          <Typography variant="body1" paragraph>
            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Image src="/images/about.webp" alt="Our Story" width={600} height={400} />
        </Grid>
      </Grid>

      {/* Teams Section */}
      <Typography variant="h4" align="center" gutterBottom>
        Our Team
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Image src="/images/agent1.png" alt="Team Member" width={180} height={200} />
            <Typography variant="h6" sx={{ mt: 2 }}>Tom Cruise</Typography>
            <Typography variant="body2" color="text.secondary">Founder & Chairman</Typography>
            <Box sx={{ mt: 1 }}>
              <TwitterIcon sx={{ mx: 1 }} />
              <InstagramIcon sx={{ mx: 1 }} />
              <LinkedInIcon sx={{ mx: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Image src="/images/agent2.png" alt="Team Member" width={160} height={200} />
            <Typography variant="h6" sx={{ mt: 2 }}>Emma Watson</Typography>
            <Typography variant="body2" color="text.secondary">Managing Director</Typography>
            <Box sx={{ mt: 1 }}>
              <TwitterIcon sx={{ mx: 1 }} />
              <InstagramIcon sx={{ mx: 1 }} />
              <LinkedInIcon sx={{ mx: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Image src="/images/agent3.png" alt="Team Member" width={150} height={200} />
            <Typography variant="h6" sx={{ mt: 2 }}>Will Smith</Typography>
            <Typography variant="body2" color="text.secondary">Product Designer</Typography>
            <Box sx={{ mt: 1 }}>
              <TwitterIcon sx={{ mx: 1 }} />
              <InstagramIcon sx={{ mx: 1 }} />
              <LinkedInIcon sx={{ mx: 1 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Service Section */}
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
};

export default AboutPage;
