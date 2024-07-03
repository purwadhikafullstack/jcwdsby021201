'use client';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Box, Typography, TextField } from '@mui/material';
import {
  UploadPictureSchema,
  uploadPictureSchema,
} from './schemas/uploadPictureSchema';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useChangeProfilePicture } from '@/features/user/profile/profileMutation';
import { useUploadPaymmentProof } from '@/features/user/order/orderMutation';

interface UploadPictureFormProps {
  handleClose: () => void;
  type: 'profile' | 'paymentProof';
  orderId?: number;
}

export default function UploadPictureForm({
  handleClose,
  type,
  orderId,
}: UploadPictureFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadPictureSchema>({
    resolver: zodResolver(uploadPictureSchema),
  });

  //STATE UNTUK FILENYA
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  //TOKEN
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //MUTATION YANG DIGUNAKAN :
  const { mutateAsync } = useChangeProfilePicture();
  const { mutateAsync: uploadPaymentProof } = useUploadPaymmentProof();

  const onSubmit = async () => {
    try {
      if (!selectedFile) {
        setErrorMessage('No file selected');
        return;
      }

      //Validasi Image Type
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      const isValidFormat = allowedFormats.includes(selectedFile.type);
      const isValidSize = selectedFile.size <= 1024 * 1024;

      //Validasi Image Type
      if (!isValidFormat) {
        setErrorMessage('Only JPG, JPEG, PNG, and GIF files are allowed.');
        return;
      }

      //Validasi Image Type
      if (!isValidSize) {
        setErrorMessage('Maximum file size is 1MB.');
        return;
      }

      setErrorMessage('');

      const formData = new FormData();
      formData.append('image', selectedFile);

      if (token) {
        if (type === 'profile') {
          await mutateAsync({ token, data: formData });
        } else {
          if (orderId) {
            await uploadPaymentProof({
              token,
              orderId,
              data: formData,
            });
          }
        }
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
