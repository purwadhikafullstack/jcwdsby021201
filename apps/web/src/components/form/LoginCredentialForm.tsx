'use client';

import NextLink from 'next/link';
import { useState } from 'react';

// MUI Components
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

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  LoginFormData,
  loginFormSchema,
} from '@/components/form/schemas/loginSchema';

// Utils
import { authPages } from '@/utils/routes';
import { useLoginTransport } from '@/features/auth/login/loginMutations';

const defaultValues: LoginFormData = {
  email: '',
  password: '',
};

export default function LoginCredentialForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { handleSubmit, control, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const { isPending, mutateAsync } = useLoginTransport();

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
    reset(defaultValues);
  };

  return (
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
            disabled={isPending}
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
            disabled={isPending}
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
      >
        Sign In
      </Button>
    </Box>
  );
}
