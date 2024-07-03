'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// MRT
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

// MUI Components
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// MUI Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// React Query
import { CategoryResponse } from '@/features/admin/categories/types';
import { useGetCategories } from '@/features/admin/categories/categoriesQueries';
import { dashboardAdminPages } from '@/utils/routes';
import { useDeleteCategory } from '@/features/admin/categories/categoriesMutations';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import ConfirmationDialog, {
  SelectedRow,
} from '@/components/dialog/ConfirmationDialog';

// NextAuth
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';

export default function CategoryTable() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;

  const { mutateAsync, isPending: isMutatePending } = useDeleteCategory();
  const { data, isError, isRefetching, isLoading, refetch } = useGetCategories(
    globalFilter,
    pagination,
    sorting,
  );

  const handleClickOpen = (row: CategoryResponse) => {
    setOpen(true);
    setSelectedRow({ id: row.id, name: row.name });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo<MRT_ColumnDef<CategoryResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableColumnActions: false,
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.result ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: data?.pagination?.total ?? 0,
    state: {
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    enableDensityToggle: false,
    enableColumnFilters: false,
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableEditing: true,
    layoutMode: 'grid',
    enableRowActions: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: '',
        size: user?.role === 'SUPER_ADMIN' ? 120 : 60,
        grow: false,
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Tooltip title={user?.role === 'SUPER_ADMIN' ? 'Edit' : 'View'}>
          <IconButton
            size="small"
            onClick={() => {
              router.push(
                dashboardAdminPages.category.path +
                  `/update/${row.original.id}`,
              );
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        {user?.role === 'SUPER_ADMIN' && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleClickOpen(row.original)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  });
  

  return (
    <>
      {user?.role === 'SUPER_ADMIN' && (
        <LinkButton
          href={dashboardAdminPages.category.path + '/create'}
          variant="create"
        >
          Category
        </LinkButton>
      )}
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MaterialReactTable table={table} />
      </Box>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        selectedRow={selectedRow}
        mutateAsync={mutateAsync}
        isMutatePending={isMutatePending}
      />
    </>
  );
}
