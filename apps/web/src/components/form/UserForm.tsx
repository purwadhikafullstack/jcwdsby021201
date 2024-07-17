'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserFormData, userSchema } from '@/components/form/schemas/userSchema';

// Styles
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
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
import GeneralTextField from '@/components/input/GeneralTextField';
import GeneralInputPassword from '@/components/input/GeneralInputPassword';

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
        <GeneralTextField
          control={control}
          name="username"
          required
          label="Username"
          placeholder="Enter Username"
          disabled={disabledOnPending}
          shrink
        />
        <GeneralTextField
          control={control}
          name="email"
          required
          type="email"
          label="Email"
          placeholder="Enter Email"
          disabled={disabledOnPending}
          shrink
        />
        <GeneralInputPassword
          control={control}
          name="password"
          required
          label="Password"
          placeholder="Enter Password"
          disabled={disabledOnPending}
          shrink
        />
        <GeneralTextField
          control={control}
          name="confirmPassword"
          required
          type="password"
          label="Confirm Password"
          placeholder="Re-enter Password"
          disabled={disabledOnPending}
          shrink
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={disabledOnPending}
            sx={buttonPrimaryStyles}
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
