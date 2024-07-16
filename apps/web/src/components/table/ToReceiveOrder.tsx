'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

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

// React Query
import { useGetToReceiveOrder } from '@/features/user/order/orderQueries';
import { UserResponse } from '@/features/user/order/type';

// NextAuth
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';

// Utils
import { toThousandFlag } from '@/utils/formatter';

// Modal
import DetailOrderModal from '@/components/modal/DetailOrderModal';

export default function ToReceiveTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const { data, isError, isPending, isRefetching, isLoading, refetch } =
    useGetToReceiveOrder(globalFilter, pagination, sorting, token || '');

  //ubah Rupiah
  const formatRupiah = (tot: number) => {
    return `Rp. ${toThousandFlag(tot)}`;
  };

  //gambar
  const image = (img: string) => {
    return (
      <Image
        src={process.env.NEXT_PUBLIC_BASE_API_URL + `${img}` || `${img}`}
        alt={img}
        width={50}
        height={50}
      />
    );
  };

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorKey: 'image',
        header: '',
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const pic = cell.getValue() as string;
          return image(pic);
        },
        size: 50,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableColumnActions: false,
      },
      {
        accessorKey: 'product',
        header: 'Product',
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <span>{(cell.getValue() as string[]).join(', ')}</span>
        ),
        size: 200,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const total = cell.getValue() as number;
          return formatRupiah(total);
        },
        size: 200,
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
    enableRowActions: false,
    positionActionsColumn: 'last',
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleOpenDetailModal(row.original.id.toString()),
      sx: {
        cursor: 'pointer',
      },
    }),
  });

  return (
    <>
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MaterialReactTable table={table} />
      </Box>
      <DetailOrderModal
        open={detailModalOpen}
        handleClose={handleCloseDetailModal}
        orderId={selectedOrderId || ''}
        token={token || ''}
      />
    </>
  );
}
