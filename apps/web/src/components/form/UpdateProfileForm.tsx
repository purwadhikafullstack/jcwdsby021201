'use client';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button, Box, Typography, TextField } from '@mui/material';
import { z } from 'zod';
import {
  ProfilePictureSchema,
  profilePictureSchema,
} from './schemas/updateProfileSchema';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useChangeProfilePicture } from '@/features/user/profile/profileMutation';

interface ProfilePictureFormProps {
  userId: number;
  handleClose: () => void;
}

export default function ProfilePictureForm({
  userId,
  handleClose,
}: ProfilePictureFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profilePictureSchema),
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { mutateAsync } = useChangeProfilePicture();

  const onSubmit = async () => {
    try {
      if (!selectedFile) {
        setErrorMessage('No file selected');
        return;
      }

      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      const isValidFormat = allowedFormats.includes(selectedFile.type);
      const isValidSize = selectedFile.size <= 1024 * 1024;

      if (!isValidFormat) {
        setErrorMessage('Only JPG, JPEG, PNG, and GIF files are allowed.');
        return;
      }

      if (!isValidSize) {
        setErrorMessage('Maximum file size is 1MB.');
        return;
      }

      setErrorMessage('');

      const formData = new FormData();
      formData.append('image', selectedFile);

      if (token) {
        await mutateAsync({ token, data: formData });
      }
      reset();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" mb={2}>
        Change Profile Picture
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <>
            <TextField
              type="file"
              fullWidth
              inputProps={{
                accept: 'image/jpeg,image/png,image/gif',
              }}
              onChange={(e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  field.onChange(file);
                }
              }}
              error={!!errors.image}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
