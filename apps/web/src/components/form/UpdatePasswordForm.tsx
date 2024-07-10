'use client';

// React Hook Form
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
// Zod
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { passwordSchema, PasswordSchema } from './schemas/updatePasswordSchema';

// Material UI
import {
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useChangeProfileUpdate } from '@/features/user/profile/profileMutation';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import StyledButton from '../button/StyledButton';

interface ChangePasswordFormProps {
  handleClose: () => void;
}

export default function ChangePasswordForm({
  handleClose,
}: ChangePasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { control, handleSubmit, reset } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      id: 0,
    },
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { mutateAsync } = useChangeProfileUpdate();

  const handleClickShowNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data: PasswordSchema) => {
    try {
      if (token) {
        await mutateAsync({ token, data: { password: data.newPassword } });
      }
      reset();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Change Password
      </Typography>

      <Controller
        control={control}
        name="newPassword"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            required
            type={showNewPassword ? 'text' : 'password'}
            error={Boolean(error)}
            helperText={error?.message}
            label="New Password"
            placeholder="Enter new password"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            required
            type={showConfirmPassword ? 'text' : 'password'}
            error={Boolean(error)}
            helperText={error?.message}
            label="Confirm Password"
            placeholder="Confirm new password"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <StyledButton type="submit" variant="contained" startIcon={<LockIcon />}>
        Submit
      </StyledButton>
    </Box>
  );
}
