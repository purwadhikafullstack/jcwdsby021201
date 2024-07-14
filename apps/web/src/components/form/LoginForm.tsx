'use client';

import { useState } from 'react';
import NextLink from 'next/link';

// MUI Components
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

// Utils
import { authPages } from '@/utils/routes';
import { errorNotification } from '@/utils/notifications';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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

// Next Auth
import { signIn } from 'next-auth/react';

const defaultValues: LoginFormData = {
  email: '',
  password: '',
};

export type Provider = 'google' | 'github' | 'discord';

export default function LoginForm() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              type="email"
              size="small"
              label="Email Address"
              variant="outlined"
              disabled={disabled}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              size="small"
              label="Password"
              variant="outlined"
              disabled={disabled}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />
          )}
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
          disabled={isPending}
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
