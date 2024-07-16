'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from '@/components/form/schemas/resetPasswordSchema';

// Utils
import { authPages } from '@/utils/routes';

// Mutations
import { useVerifyToken } from '@/features/auth/verify/verifyMutations';
import { useResetPassword } from '@/features/auth/resetPassword/resetPasswordMutations';

const defaultValues: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

type Props = {
  name?: string;
  path: string;
};

export default function ResetPasswordForm({ name, path }: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
            disabled={isVerifyPending || isResetPending}
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
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            required
            type="password"
            size="small"
            label="Confirm Password"
            variant="outlined"
            disabled={isVerifyPending || isResetPending}
            {...field}
            helperText={error?.message}
            error={Boolean(error)}
            InputLabelProps={{ shrink: true, required: true }}
          />
        )}
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
