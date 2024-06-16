// MUI Components
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';

// Custom Components
import LoginCredentialForm from '@/components/form/LoginCredentialForm';
import GoogleButton from '@/components/button/GoogleButton';
import GithubButton from '@/components/button/GithubButton';
import DiscordButton from '@/components/button/DiscordButton';

export default function LoginForm() {
  return (
    <Box sx={formWrapperStyles}>
      <LoginCredentialForm />
      <Divider>
        <Typography variant="caption" textAlign="center">
          Login with
        </Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <GoogleButton />
        </Grid>
        <Grid item xs={4}>
          <GithubButton />
        </Grid>
        <Grid item xs={4}>
          <DiscordButton />
        </Grid>
      </Grid>
    </Box>
  );
}
