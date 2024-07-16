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
import { useGetInventories } from '@/features/admin/inventories/inventoriesQueries';
import { InventoryResponse } from '@/features/admin/inventories/types';
import { dashboardAdminPages } from '@/utils/routes';
import { useDeleteInventory } from '@/features/admin/inventories/inventoriesMutations';

// Utils
import { toThousandFlag } from '@/utils/formatter';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import ConfirmationDialog, {
  SelectedRow,
} from '@/components/dialog/ConfirmationDialog';

export default function InventoryTable() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const router = useRouter();

  const { mutateAsync, isPending: isMutatePending } = useDeleteInventory();
  const { data, isError, isRefetching, isLoading, refetch } = useGetInventories(
    globalFilter,
    pagination,
    sorting,
  );

  const handleClickOpen = (row: InventoryResponse) => {
    setOpen(true);
    setSelectedRow({ id: row.id, name: row.product.name });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo<MRT_ColumnDef<InventoryResponse>[]>(
    () => [
      {
        accessorKey: 'warehouse.name',
        header: 'Warehouse',
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
        accessorKey: 'stock',
        header: 'Stock',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        Cell: ({ cell }) => toThousandFlag(cell.getValue() as number),
      },
      {
        accessorKey: 'product.price',
        header: 'Price',
        enableColumnActions: false,
        enableSorting: false,
        enableFilterMatchHighlighting: false,
        Cell: ({ cell }) => toThousandFlag(cell.getValue() as number),
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
              dashboardAdminPages.inventory.path + `/update/${row.original.id}`
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
        href={dashboardAdminPages.inventory.path + '/create'}
        variant="create"
      >
        Inventory
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
