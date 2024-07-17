'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  categorySchema,
  CategoryFormData,
} from '@/components/form/schemas/categorySchema';
import { dashboardAdminPages } from '@/utils/routes';

// Styles
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { ResponseWithData, UserSession } from '@/features/types';
import { CategoryResponse } from '@/features/admin/categories/types';

// TanStack
import { useGetCategory } from '@/features/admin/categories/categoriesQueries';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/features/admin/categories/categoriesMutations';

// Utils
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import GeneralTextField from '@/components/input/GeneralTextField';

// NextAuth
import { useSession } from 'next-auth/react';

const defaultValues: CategoryFormData = {
  name: '',
};

type CategoryFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<CategoryResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  id?: string;
};

export default function CategoryForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  id,
}: CategoryFormProps) {
  const { handleSubmit, control, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const disabledOnPending = isMutatePending || isQueryPending;
  const onlySuperAdmin = disabledOnPending || user?.role !== 'SUPER_ADMIN';

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.category.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    reset(queryData?.result);
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const onSubmit = async (data: CategoryFormData) => {
    if (queryData) {
      await mutateAsync({ ...data, id: queryData.result.id });
    } else {
      await mutateAsync(data);
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
          name="name"
          required
          label="Name"
          placeholder="Category Name"
          disabled={onlySuperAdmin}
          shrink
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          {user?.role === 'SUPER_ADMIN' && (
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={disabledOnPending}
              sx={buttonPrimaryStyles}
            >
              Submit
            </Button>
          )}
          <LinkButton
            href={dashboardAdminPages.category.path}
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

export function CategoryFormCreate() {
  const { mutateAsync, isPending } = useCreateCategory();
  return <CategoryForm mutateAsync={mutateAsync} isMutatePending={isPending} />;
}

export function CategoryFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } = useUpdateCategory();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
  } = useGetCategory(id);

  return (
    <CategoryForm
      mutateAsync={mutateAsync}
      isMutatePending={isMutatePending}
      queryData={data}
      errorQuery={errorQuery}
      isQueryPending={isQueryPending}
      isErrorQuery={isErrorQuery}
    />
  );
}
