'use client';

// React Hook Form
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { Add as AddIcon } from '@mui/icons-material';
// Zod
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { usernameSchema, UsernameSchema } from './schemas/updateUsernameSchema';
// Schema untuk validasi

// Material UI
import { Button, Box, Typography, TextField } from '@mui/material';
import { UserSession } from '@/features/types';
import { useSession } from 'next-auth/react';
import { useChangeProfileUpdate } from '@/features/user/profile/profileMutation';
import StyledButton from '../button/StyledButton';
// Penampung

interface ChangeUsernameFormProps {
  initialUsername: string;
  handleClose: () => void; // Tambahkan tipe untuk handleClose
}

export default function ChangeUsernameForm({
  initialUsername,
  handleClose,
}: ChangeUsernameFormProps) {
  const { control, handleSubmit, reset } = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: initialUsername,
      id: 0,
    },
  });
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { mutateAsync } = useChangeProfileUpdate();

  const onSubmit = async (data: UsernameSchema) => {
    try {
      if (token) {
        await mutateAsync({ token, data: { username: data.username } });
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
        Change Username
      </Typography>

      <Controller
        control={control}
        name="username"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            required
            error={Boolean(error)}
            helperText={error?.message}
            label="New Username"
            placeholder="Enter new username"
            size="small"
          />
        )}
      />

      <StyledButton type="submit" variant="contained" startIcon={<AddIcon />}>
        Submit
      </StyledButton>
    </Box>
  );
}
