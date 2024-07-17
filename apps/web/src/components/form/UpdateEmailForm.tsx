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
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import { apiRoutes } from '@/utils/routes';

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
          `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiRoutes.users.path}/email-availability`,
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
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Change Email
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
      <Typography variant="overline" gutterBottom sx={{ lineHeight: '16px' }}>
        If you change your email address, you&#39;ll need to verify it again.
      </Typography>

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
        variant="contained"
        startIcon={<SendIcon />}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ChangeEmailForm;
