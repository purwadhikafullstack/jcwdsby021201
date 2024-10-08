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
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

  //ROTER
  const router = useRouter();

  //STATE UNTUK FILENYA
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);

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

      let allowedFormats: string[];
      let errorMessage: string;

      if (type === 'profile') {
        allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        errorMessage =
          'Only JPG, JPEG, PNG, and GIF files are allowed for profile pictures.';
      } else {
        allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
        errorMessage =
          'Only JPG, JPEG, and PNG files are allowed for payment proof.';
      }

      const isValidFormat = allowedFormats.includes(selectedFile.type);
      const isValidSize = selectedFile.size <= 1024 * 1024;

      if (!isValidFormat) {
        setErrorMessage(errorMessage);
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
        if (type === 'profile') {
          await mutateAsync({ token, data: formData });
        } else {
          if (orderId) {
            await uploadPaymentProof({
              token,
              orderId,
              data: formData,
            });
            router.push('/dashboard/user/order/to-ship');
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
      <Typography variant="h6" mb={2} sx={{ textTransform: 'uppercase' }}>
        {type === 'profile' ? 'Change Profile Picture' : 'Upload Payment Proof'}
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
                  setPreviewURL(URL.createObjectURL(file));
                  field.onChange(file);
                }
              }}
              error={!!errors.image}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            {previewURL && (
              <Box mt={2}>
                <Image
                  width={1000}
                  height={1000}
                  src={previewURL}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </>
        )}
      />
      <Button
        sx={{
          mt: '10px',
          fontWeight: 'bold',
          padding: '12px 16px',
          fontSize: '14px',
          textTransform: 'uppercase',
          ...buttonPrimaryStyles,
        }}
        type="submit"
        fullWidth
      >
        Submit
      </Button>
    </Box>
  );
}
