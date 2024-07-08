'use client';

import { useMemo } from 'react';

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

// MUI Icons
import RefreshIcon from '@mui/icons-material/Refresh';

// React Query
import { HistoryResponse, ResponseDataPagination } from '@/features/types';

// Utils
import { toThousandFlag } from '@/utils/formatter';

// Moment
import moment from 'moment';

type Props = {
  data: ResponseDataPagination<HistoryResponse[]> | undefined;
  isError: boolean;
  isRefetching: boolean;
  isLoading: boolean;
  refetch: () => void;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: MRT_SortingState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  pagination: MRT_PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
};

export default function GeneralHistoryTable({
  data,
  isError,
  isLoading,
  isRefetching,
  refetch,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  pagination,
  setPagination,
}: Props) {
  const columns = useMemo<MRT_ColumnDef<HistoryResponse>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        size: 240,
        grow: false,
        Cell: ({ cell }) => {
          const dateStr = cell.getValue() as string;
          return moment(dateStr).format('MMM DD YYYY HH:mm:ss');
        },
      },
      {
        accessorKey: 'transactionType',
        header: 'Type',
        enableColumnActions: false,
        enableFilterMatchHighlighting: false,
        size: 180,
        grow: false,
      },
      {
        accessorKey: 'quantity',
        header: 'Qty',
        enableColumnActions: false,
        size: 180,
        grow: false,
        Cell: ({ cell }) => toThousandFlag(cell.getValue() as number),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableColumnActions: false,
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
    layoutMode: 'grid',
  });

  return <MaterialReactTable table={table} />;
}
