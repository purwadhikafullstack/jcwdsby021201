'use client';

import React, { useMemo, useState } from 'react';
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
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';

// React Query
import { useGetUsers } from '@/features/admin/users/usersQueries';
import { UserResponse } from '@/features/admin/users/types';
import { useDeleteUser } from '@/features/admin/users/usersMutations';

// Utils
import { dashboardAdminPages } from '@/utils/routes';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import ConfirmationDialog, {
  SelectedRow,
} from '@/components/dialog/ConfirmationDialog';

type Role = 'ADMIN' | 'USER';

export default function UserTable() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>('ADMIN');
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const router = useRouter();

  const { mutateAsync, isPending: isMutatePending } = useDeleteUser();
  const { data, isError, isRefetching, isLoading } = useGetUsers(
    globalFilter,
    pagination,
    sorting,
    role,
  );

  const handleClickOpen = (row: UserResponse) => {
    setOpen(true);
    setSelectedRow({ id: row.id, name: row.email });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeRole = (e: SelectChangeEvent<Role>) => {
    setRole(e.target.value as Role);
  };

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnActions: false,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        enableColumnActions: false,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
      },
      {
        accessorKey: 'isVerified',
        header: 'Verified',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
      },
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
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <Select
          value={role}
          onChange={handleChangeRole}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      </FormControl>
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
        size: 120,
        grow: false,
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          width: '100%',
          justifyContent: 'end',
        }}
      >
        {row.getValue('role') === 'ADMIN' ? (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => {
                  router.push(
                    dashboardAdminPages.user.path +
                      `/update/${row.original.id}`,
                  );
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleClickOpen(row.original)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Lock">
            <IconButton size="small" color="warning">
              <LockIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  });

  return (
    <>
      <LinkButton
        href={dashboardAdminPages.user.path + '/create'}
        variant="create"
      >
        User
      </LinkButton>
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
