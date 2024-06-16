import Image from 'next/image';
import Link from 'next/link';

// MUI Components
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Images
import brokenFile from '@/public/images/broken-file.jpg';

// Utils
import { mainPages } from '@/utils/routes';
export default function TokenExpired() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 300, md: 400 },
        }}
      >
        <Image
          src={brokenFile}
          alt="Token Expired"
          width={400}
          height={400}
          objectFit="contain"
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 500, mb: 1 }}>
        Token Expired
      </Typography>
      <Typography
        component="p"
        variant="body1"
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        The token you provided has expired. Please try again.
      </Typography>
      <Link href={mainPages.home.path} passHref>
        <Button size="large" variant="contained">
          Back To Home
        </Button>
      </Link>
    </Container>
  );
}
