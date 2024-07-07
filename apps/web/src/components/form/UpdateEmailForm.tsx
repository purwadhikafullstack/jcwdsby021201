import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, EmailSchema } from './schemas/updateEmailSchema';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useChangeProfileEmail } from '@/features/user/profile/profileMutation';
import StyledButton from '../button/StyledButton';

interface ChangeEmailFormProps {
  initialEmail: string;
  handleClose: () => void;
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  initialEmail,
  handleClose,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { mutateAsync } = useChangeProfileEmail();

  const onSubmit = async (data: EmailSchema) => {
    try {
      if (token) {
        const response = await axios.post(
          'http://localhost:8000/users/email-availability',
          { email: data.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.data) {
          setError('email', {
            type: 'manual',
            message: 'Email is already taken',
          });
          return;
        }

        await mutateAsync({ token, data: { email: data.email } });
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
      <Typography variant="h4" gutterBottom>
        Change Email
      </Typography>

      <Typography
        sx={{ textAlign: 'left', fontSize: '14px' }}
        variant="inherit"
        gutterBottom
      >
        If you change your email address, you'll need to verify it again.
      </Typography>

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            required
            error={Boolean(error)}
            helperText={error?.message}
            label="New Email"
            placeholder="Enter new email"
            size="small"
          />
        )}
      />

      <StyledButton type="submit" variant="contained" startIcon={<SendIcon />}>
        Submit
      </StyledButton>
    </Box>
  );
};

export default ChangeEmailForm;
