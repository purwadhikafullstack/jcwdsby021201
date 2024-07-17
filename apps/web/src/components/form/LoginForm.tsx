'use client';

import { useState } from 'react';
import NextLink from 'next/link';

// MUI Components
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

// Utils
import { authPages } from '@/utils/routes';
import { errorNotification } from '@/utils/notifications';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  LoginFormData,
  loginFormSchema,
} from '@/components/form/schemas/loginSchema';

// Mutations
import { useLoginTransport } from '@/features/auth/login/loginMutations';

// Custom Components
import GoogleButton from '@/components/button/GoogleButton';
import GithubButton from '@/components/button/GithubButton';
import DiscordButton from '@/components/button/DiscordButton';
import GeneralTextField from '@/components/input/GeneralTextField';
import GeneralInputPassword from '@/components/input/GeneralInputPassword';

// Next Auth
import { signIn } from 'next-auth/react';

const defaultValues: LoginFormData = {
  email: '',
  password: '',
};

export type Provider = 'google' | 'github' | 'discord';

export default function LoginForm() {
  const [isSignIn, setIsSignIn] = useState(false);
  const { handleSubmit, control, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const { isPending, mutateAsync } = useLoginTransport();
  const disabled = isPending || isSignIn;

  const handleSignIn = (provider: Provider) => {
    setIsSignIn(true);
    try {
      signIn(provider);
    } catch (error) {
      errorNotification('Internal Server Error');
      setIsSignIn(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
    reset(defaultValues);
  };

  return (
    <Box sx={formWrapperStyles}>
      <Box
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
            Sign in
          </Typography>
          <Link
            component={NextLink}
            href={authPages.register.path}
            underline="none"
            variant="body1"
            sx={{ color: 'primary.light' }}
          >
            Don&apos;t have an account?
          </Link>
        </Stack>
        <GeneralTextField
          control={control}
          name="email"
          required
          type="email"
          label="Email Address"
          disabled={disabled}
          shrink
        />
        <GeneralInputPassword
          control={control}
          name="password"
          required
          label="Password"
          disabled={disabled}
          shrink
        />
        <Stack direction="row" justifyContent="end">
          <Link
            component={NextLink}
            href={authPages.forgotPassword.path}
            underline="hover"
            variant="body1"
            sx={{ color: 'black' }}
          >
            Forgot Password?
          </Link>
        </Stack>
        <Button
          fullWidth
          size="large"
          variant="contained"
          type="submit"
          disabled={disabled}
          sx={buttonPrimaryStyles}
        >
          Sign In
        </Button>
      </Box>
      <Divider>
        <Typography variant="caption" textAlign="center">
          Login with
        </Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <GoogleButton
            handleSignIn={() => handleSignIn('google')}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <GithubButton
            handleSignIn={() => handleSignIn('github')}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <DiscordButton
            handleSignIn={() => handleSignIn('discord')}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
