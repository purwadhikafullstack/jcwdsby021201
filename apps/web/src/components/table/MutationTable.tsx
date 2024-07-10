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

// React Query
import { useGetMutations } from '@/features/admin/mutations/mutationsQueries';
import { MutationResponse } from '@/features/admin/mutations/types';
import { dashboardAdminPages } from '@/utils/routes';

// Utils
import { toThousandFlag } from '@/utils/formatter';

// Custom Components
import LinkButton from '@/components/button/LinkButton';

export default function MutationTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const router = useRouter();
  const { data, isError, isRefetching, isLoading, refetch } = useGetMutations(
    globalFilter,
    pagination,
    sorting,
  );

  const columns = useMemo<MRT_ColumnDef<MutationResponse>[]>(
    () => [
      {
        accessorKey: 'sourceWarehouse.name',
        header: 'Warehouse Source',
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'destinationWarehouse.name',
        header: 'Warehouse Destination',
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'product.name',
        header: 'Product',
        enableColumnActions: false,
        enableSorting: false,
      },
      {
        accessorKey: 'stockRequest',
        header: 'Stock Request',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        Cell: ({ cell }) => toThousandFlag(cell.getValue() as number),
      },
      {
        accessorKey: 'stockProcess',
        header: 'Stock Process',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        Cell: ({ cell }) =>
          (cell.getValue() as number | null)
            ? toThousandFlag(cell.getValue() as number)
            : '-',
      },
      {
        accessorKey: 'status',
        header: 'Status',
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
        size: 60,
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
            onClick={() => {
              router.push(
                dashboardAdminPages.mutation.path +
                  `/update/${row.original.id}`,
              );
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <LinkButton
        href={dashboardAdminPages.mutation.path + '/create'}
        variant="create"
      >
        Mutation
      </LinkButton>
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MaterialReactTable table={table} />
      </Box>
    </>
  );
}
