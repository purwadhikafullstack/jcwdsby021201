// MUI Components
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// Views
import SampleGroupCard from '@/views/home/SampleGroupCard';

// Custom Components
import SampleForm from '@/components/form/SampleForm';
import { Grid } from '@mui/material';
import Navbar from '@/components/core/Navbar';

export default function Home() {
  return (
    <Container component="main">
     
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'red', fontWeight: 'bold' }}
      >
        Hello World
      </Typography>

      <Grid container gap={2}>
        <SampleGroupCard />
      </Grid>

      <Box sx={{ marginTop: '20px' }}>
        <SampleForm />
      </Box>
    </Container>
  );
}
