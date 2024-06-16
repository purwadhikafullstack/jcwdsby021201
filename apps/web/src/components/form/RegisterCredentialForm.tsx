'use client';

import NextLink from 'next/link';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Utils
import { authPages } from '@/utils/routes';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  RegisterFormData,
  registerFormSchema,
} from '@/components/form/schemas/registerSchema';

// Mutations
import { useRegister } from '@/features/auth/register/registerMutations';

const defaultValues: RegisterFormData = {
  email: '',
};

export default function RegisterCredentialForm() {
  const { handleSubmit, control, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const { isPending, mutateAsync } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    await mutateAsync(data);
    reset(defaultValues);
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
          Sign up
        </Typography>
        <Link
          component={NextLink}
          href={authPages.login.path}
          underline="none"
          variant="body1"
          sx={{ color: 'primary.light' }}
        >
          Already have an account?
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
      <Button
        fullWidth
        size="large"
        variant="contained"
        type="submit"
        disabled={isPending}
      >
        Sign Up
      </Button>
    </Box>
  );
}
