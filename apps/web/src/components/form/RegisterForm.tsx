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
  RegisterFormData,
  registerFormSchema,
} from '@/components/form/schemas/registerSchema';

// Mutations
import { useRegister } from '@/features/auth/register/registerMutations';

// Custom Components
import GoogleButton from '@/components/button/GoogleButton';
import GithubButton from '@/components/button/GithubButton';
import DiscordButton from '@/components/button/DiscordButton';
import GeneralTextField from '@/components/input/GeneralTextField';

// Next Auth
import { signIn } from 'next-auth/react';

const defaultValues: RegisterFormData = {
  email: '',
};

export type Provider = 'google' | 'github' | 'discord';

export default function RegisterForm() {
  const [isSignIn, setIsSignIn] = useState(false);
  const { handleSubmit, control, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const { isPending, mutateAsync } = useRegister();
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

  const onSubmit = async (data: RegisterFormData) => {
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
            Sign up
          </Typography>
          <Link
            component={NextLink}
            href={authPages.login.path}
            underline="none"
            variant="body1"
            sx={{ color: 'primary.light' }}
            aria-disabled={disabled}
          >
            Already have an account?
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
        <Button
          fullWidth
          size="large"
          variant="contained"
          type="submit"
          disabled={disabled}
          sx={buttonPrimaryStyles}
        >
          Sign Up
        </Button>
      </Box>
      <Divider>
        <Typography variant="caption" textAlign="center">
          Register with
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
