'use client';

import Link from 'next/link';
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
import { WarehouseResponse } from '@/features/admin/warehouses/types';
import { useGetWarehouses } from '@/features/admin/warehouses/warehousesQueries';
import { useDeleteWarehouse } from '@/features/admin/warehouses/warehousesMutations';
import { dashboardAdminPages } from '@/utils/routes';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import ConfirmationDialog, {
  SelectedRow,
} from '@/components/dialog/ConfirmationDialog';

export default function WarehouseTable() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const router = useRouter();

  const { mutateAsync, isPending: isMutatePending } = useDeleteWarehouse();
  const { data, isError, isRefetching, isLoading, refetch } = useGetWarehouses(
    globalFilter,
    pagination,
    sorting,
  );

  const handleClickOpen = (row: WarehouseResponse) => {
    setOpen(true);
    setSelectedRow({ id: row.id, name: row.name });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo<MRT_ColumnDef<WarehouseResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableColumnActions: false,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        enableColumnActions: false,
      },
      {
        accessorKey: 'province.name',
        header: 'Province',
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'city.name',
        header: 'City',
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'postalCode',
        header: 'Postal Code',
        enableColumnActions: false,
      },
      {
        accessorKey: 'user.username',
        header: 'Admin',
        enableColumnActions: false,
        enableSorting: false,
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
        size: 120,
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
        <Tooltip title="Edit">
          <IconButton
            size="small"
            LinkComponent={Link}
            href={
              dashboardAdminPages.warehouse.path + `/update/${row.original.id}`
            }
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
      </Box>
    ),
  });

  return (
    <>
      <LinkButton
        href={dashboardAdminPages.warehouse.path + '/create'}
        variant="create"
      >
        Warehouse
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
