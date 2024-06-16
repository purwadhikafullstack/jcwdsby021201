'use client';

import NextLink from 'next/link';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Styles
import { formWrapperStyles } from '@/styles/authFormStyles';

// Utils
import { authPages } from '@/utils/routes';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '@/components/form/schemas/forgotPasswordSchema';

// Mutations
import { useForgotPassword } from '@/features/auth/forgotPassword/forgotPasswordMutations';

const defaultValues: ForgotPasswordFormData = {
  email: '',
};

export default function ForgotPasswordForm() {
  const { handleSubmit, control, reset } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await mutateAsync(data);
    reset(defaultValues);
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={formWrapperStyles}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
          Forgot Password
        </Typography>
        <Link
          component={NextLink}
          href={authPages.login.path}
          underline="none"
          variant="body1"
          sx={{ color: 'primary.light' }}
        >
          Back to Sign In
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
      <Box>
        <Typography variant="caption">
          Don&apos;t forgot to check SPAM box.
        </Typography>
        <Button
          fullWidth
          size="large"
          variant="contained"
          type="submit"
          disabled={isPending}
          sx={{ mt: 1 }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
