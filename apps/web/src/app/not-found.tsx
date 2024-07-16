import Link from 'next/link';

import notFound from '@/public/images/404.jpg';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { mainPages } from '@/utils/routes';
export default function NotFoundPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        height: '100%',
      }}
    >
      <Box
        sx={{
          diaplay: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 300, md: 400 },
        }}
      >
        <Image
          src={notFound}
          alt="404"
          width={400}
          height={400}
          objectFit="contain"
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 500, mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography
        component="p"
        variant="body1"
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        The page you are looking was moved or removed, renamed, or might never
        existed!
      </Typography>
      <Link href={mainPages.home.path} passHref>
        <Button size="large" variant="contained">
          Back To Home
        </Button>
      </Link>
    </Container>
  );
}
