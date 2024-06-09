'use client';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Tanstack Query
import { useGetSamples } from '@/features/user/samples/sampleQueries';

// Utils
import { errorFetcherNotification } from '@/utils/notifications';
import { Grid } from '@mui/material';

export default function SampleGroupCard() {
  const { isPending, isError, data, error } = useGetSamples();

  if (isPending) return <Typography>Loading...</Typography>;

  if (isError) {
    errorFetcherNotification(error);
  }

  return data?.result.map((sample) => (
    <Grid
      item
      key={sample.id}
      xs={3}
      sx={{ border: '1px solid black', p: 1, borderRadius: '5px' }}
    >
      <Typography variant="h5" component="h2">
        {sample.name}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        textAlign="end"
        sx={{ fontWeight: 'bold' }}
      >
        {sample.code}
      </Typography>
    </Grid>
  ));
}
