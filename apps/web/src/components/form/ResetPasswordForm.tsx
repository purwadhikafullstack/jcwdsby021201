'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from '@/components/form/schemas/resetPasswordSchema';

// Utils
import { authPages } from '@/utils/routes';

// Mutations
import { useVerifyToken } from '@/features/auth/verify/verifyMutations';
import { useResetPassword } from '@/features/auth/resetPassword/resetPasswordMutations';

// Custom Components
import GeneralInputPassword from '@/components/input/GeneralInputPassword';
import GeneralTextField from '@/components/input/GeneralTextField';

const defaultValues: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

type Props = {
  name?: string;
  path: string;
};

export default function ResetPasswordForm({ name, path }: Props) {
  const { handleSubmit, control, reset } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
  });

  const params = useParams();
  const { isPending: isVerifyPending, mutateAsync: verifyMutateAsync } =
    useVerifyToken();
  const { isPending: isResetPending, mutateAsync: resetMutateAsync } =
    useResetPassword();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (path === authPages.verify.path && typeof params.token === 'string') {
      await verifyMutateAsync({
        token: params.token,
        password: data.password,
      });
      reset(defaultValues);
    } else if (
      path === authPages.resetPassword.path &&
      typeof params.token === 'string'
    ) {
      await resetMutateAsync({
        token: params.token,
        password: data.password,
      });
      reset(defaultValues);
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={formWrapperStyles}
    >
      <Box>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
          {name || 'Reset Password'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', my: 1 }}>
          Please choose your new password
        </Typography>
      </Box>
      <GeneralInputPassword
        control={control}
        name="password"
        required
        label="Password"
        disabled={isVerifyPending || isResetPending}
        shrink
      />
      <GeneralTextField
        control={control}
        name="confirmPassword"
        required
        type="password"
        label="Confirm Password"
        disabled={isVerifyPending || isResetPending}
        shrink
      />
      <Box>
        <Button
          fullWidth
          size="large"
          variant="contained"
          type="submit"
          disabled={isVerifyPending || isResetPending}
          sx={buttonPrimaryStyles}
        >
          {name || 'Reset Password'}
        </Button>
      </Box>
    </Box>
  );
}
