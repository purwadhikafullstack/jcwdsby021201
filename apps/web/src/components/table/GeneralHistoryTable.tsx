'use client';

import { useEffect, useMemo, useState } from 'react';

// MRT
import {
  MaterialReactTable,
  MRT_Row,
  MRT_RowSelectionState,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

// MUI Icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// React Query
import { HistoryResponse, ResponseDataPagination } from '@/features/types';

// Utils
import { toThousandFlag } from '@/utils/formatter';

// Moment
import moment from 'moment';

// Export
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Box, Button } from '@mui/material';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

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
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [rows, setRows] = useState<MRT_Row<HistoryResponse>[]>([]);

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

  const handleExportRows = (rows: HistoryResponse[]) => {
    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
  };

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
    enableRowSelection: true,
    getRowId: (row) => `${row.id}`,
    paginationDisplayMode: 'pages',
    onRowSelectionChange: setRowSelection,
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={!Object.keys(rowSelection).length}
          startIcon={<FileDownloadIcon />}
          onClick={() => {
            const keys = Object.keys(rowSelection);
            const res: HistoryResponse[] = [];
            rows.forEach((row) => {
              if (keys.includes(row.id)) res.push(row.original);
            });

            handleExportRows(res);
          }}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
    rowCount: data?.pagination?.total ?? 0,
    state: {
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },
    enableDensityToggle: false,
    enableColumnFilters: false,
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    layoutMode: 'grid',
  });

  useEffect(() => {
    if (Object.keys(rowSelection).length) {
      Object.keys(rowSelection).forEach((key) => {
        try {
          const getRow = table.getRow(key);
          // @ts-ignore
          setRows((prevRows) => {
            const updatedRows = !prevRows.some((row) => row.id === getRow.id)
              ? [...prevRows, getRow]
              : prevRows;

            updatedRows.sort((a, b) => Number(a.id) - Number(b.id));
            return updatedRows;
          });
        } catch (error) {
          return;
        }
      });
    } else {
      setRows([]);
    }
  }, [rowSelection, table]);

  return <MaterialReactTable table={table} />;
}
