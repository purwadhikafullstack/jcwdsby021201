'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { UserFormData, userSchema } from '@/components/form/schemas/userSchema';

// Styles
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { ResponseWithData } from '@/features/types';
import { UserResponse } from '@/features/admin/users/types';

// TanStack
import {
  useCreateUser,
  useUpdateUser,
} from '@/features/admin/users/usersMutations';
import { useGetUser } from '@/features/admin/users/usersQueries';

// Utils
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';

// Custom Components
import LinkButton from '@/components/button/LinkButton';

const defaultValues: UserFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type UserFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<UserResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  id?: string;
};

export default function UserForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  id,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { handleSubmit, control, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const router = useRouter();
  const disabledOnPending = isMutatePending || isQueryPending;

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.user.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      const { username, email } = queryData.result;
      reset({ username: username ?? '', email });
    }
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const onSubmit = async (data: UserFormData) => {
    const { confirmPassword, ...payload } = data;

    if (queryData) {
      await mutateAsync({ id: queryData?.result?.id, ...payload });
    } else {
      await mutateAsync(payload);
      reset(defaultValues);
    }
  };

  return (
    <Box component="main" sx={adminFormContainerStyles}>
      <Box
        component="form"
        autoCapitalize="off"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={adminFormStyles}
      >
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Username"
              variant="outlined"
              placeholder="Enter Username"
              disabled={disabledOnPending}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              type="email"
              size="small"
              label="Email"
              variant="outlined"
              placeholder="Enter Email"
              disabled={disabledOnPending}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              placeholder="Enter Password"
              disabled={disabledOnPending}
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
              placeholder="Re-enter Password"
              disabled={disabledOnPending}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={disabledOnPending}
            sx={{
              color: 'white',
              backgroundColor: 'black',
              borderRadius: '0',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: '#333333',
                color: 'white',
              },
            }}
          >
            Submit
          </Button>
          <LinkButton
            href={dashboardAdminPages.user.path}
            variant="back"
            disabled={disabledOnPending}
          >
            Back
          </LinkButton>
        </Box>
      </Box>
    </Box>
  );
}

export function UserFormCreate() {
  const { mutateAsync, isPending } = useCreateUser();
  return <UserForm mutateAsync={mutateAsync} isMutatePending={isPending} />;
}

export function UserFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } = useUpdateUser();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
  } = useGetUser(id);

  return (
    <UserForm
      mutateAsync={mutateAsync}
      isMutatePending={isMutatePending}
      queryData={data}
      errorQuery={errorQuery}
      isQueryPending={isQueryPending}
      isErrorQuery={isErrorQuery}
      id={id}
    />
  );
}
