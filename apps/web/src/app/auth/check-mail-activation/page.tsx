import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { formWrapperStyles } from '@/styles/authFormStyles';
import { authPages, mainPages } from '@/utils/routes';

export default function CheckMailActivationPage() {
  return (
    <Box component="main" sx={formWrapperStyles}>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
        Hi, Check Your Mail
      </Typography>
      <Box>
        <Typography component="p" variant="body2" sx={{ mb: 1 }}>
          An account activation email has been sent to your new email address.
          Please check your inbox to activate your account.
        </Typography>
        <Link href={mainPages.home.path} passHref>
          <Button fullWidth size="large" variant="contained">
            Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
