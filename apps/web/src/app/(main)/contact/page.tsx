import React from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import { contactMetadata } from '@/app/meta-tag';

export const metadata = contactMetadata;

const ContactPage = () => {
  return (
    <Box pb={8}>
      <Container maxWidth="lg">
        <Box mt={4} mb={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Phone fontSize="large" sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6">Call To Us</Typography>
              </Box>
              <Typography variant="body1">
                We are available 24/7, 7 days a week.
              </Typography>
              <Typography variant="body1">Phone: +8801611222222</Typography>
              <Box my={2} borderBottom="1px solid #ddd" />
              <Box display="flex" alignItems="center" mb={2}>
                <Email fontSize="large" sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6">Write To Us</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                Fill out our form and we will contact you within 24 hours.
              </Typography>
              <Typography variant="body1">
                Emails: customer@exclusive.com
              </Typography>
              <Typography variant="body1">
                Emails: support@exclusive.com
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Your Name *" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Your Email *" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Your Phone *" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Your Message"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#d32f2f', color: '#ffffff' }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
