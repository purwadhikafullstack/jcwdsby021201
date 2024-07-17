'use client';
import Image from 'next/image';
import { Button } from '@mui/material';
import { toThousandFlag } from '@/utils/formatter';

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
import { useGetUnpaidOrder } from '@/features/user/order/orderQueries';
import { UserResponse } from '@/features/user/order/type';
import { useCancelOrder } from '@/features/user/order/orderMutation';

// Custom Components
import ConfirmationCancel from '../dialog/ConfirmationCancel';

// NextAuth
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import PaymentProofModal from '../modal/PaymentProofModal';
import DetailOrderModal from '../modal/DetailOrderModal';
import { useRouter } from 'next/navigation';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

export default function ToPayTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const router = useRouter();

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentProofModal, setPaymentProofModal] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailModalOpen(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOpenPaymentProofModal = (orderId: any) => {
    setSelectedOrderId(orderId);
    setPaymentProofModal(true);
  };
  const handleClosePaymentProofModal = () => {
    setPaymentProofModal(false);
    setSelectedOrderId(null);
    refetch();
  };

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenCancelDialog(true);
  };

  const { mutateAsync: cancelOrderMutate } = useCancelOrder();
  const cancelOrder = async (orderId: string) => {
    try {
      if (token) {
        await cancelOrderMutate({
          token,
          orderId,
        });
      }
      refetch();
      setOpenCancelDialog(false);
    } catch (error) {}
  };

  const { data, isError, isPending, isRefetching, isLoading, refetch } =
    useGetUnpaidOrder(globalFilter, pagination, sorting, token || '');

  //ubah Rupiah
  const formatRupiah = (tot: number) => {
    return `Rp. ${toThousandFlag(tot)}`;
  };

  //gambar
  const image = (img: string | null) => {
    return (
      img && (
        <Image
          src={process.env.NEXT_PUBLIC_BASE_API_URL + `${img}` || `${img}`}
          alt={img}
          width={50}
          height={50}
        />
      )
    );
  };

  // tanggal
  const formatDate = (date: string) => {
    return date.split('T')[0];
  };
  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorKey: 'image',
        header: '',
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const pic = (cell.getValue() as string) || null;
          return image(pic);
        },
        size: 50,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableColumnActions: false,
        size: 150,
      },
      {
        accessorKey: 'product',
        header: 'Product',
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <span>{(cell.getValue() as string[]).join(', ')}</span>
        ),
        size: 100,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const total = cell.getValue() as number;
          return formatRupiah(total);
        },
        size: 100,
      },
      {
        accessorKey: 'createdAt',
        header: 'Order Date',
        enableColumnActions: false,
        Cell: ({ cell }) => {
          const date = cell.getValue() as string;
          return formatDate(date);
        },
        size: 100,
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
        header: 'Action',
        size: 350,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    },
    renderRowActions: ({ row }) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          gap: '20px',
        }}
      >
        {user?.role === 'USER' && (
          <>
            <Tooltip title="Upload Payment Proof">
              <Button
                variant="contained"
                sx={{
                  ...buttonPrimaryStyles,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/transfer/${row.original.name}${row.original.id}`,
                  );
                }}
              >
                Payment
              </Button>
            </Tooltip>
            <Tooltip title="Cancel Order">
              <Button
                variant="contained"
                sx={{
                  ...buttonPrimaryStyles,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelClick(row.original.id.toString());
                }}
              >
                Cancel Order
              </Button>
            </Tooltip>
          </>
        )}
      </Box>
    ),
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
      <ConfirmationCancel
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        mutation={cancelOrder}
        isPending={isPending}
        orderId={selectedOrderId || ''}
      />
      <PaymentProofModal
        handleClose={handleClosePaymentProofModal}
        open={paymentProofModal}
        orderId={Number(selectedOrderId) || 0}
      />
      <DetailOrderModal
        open={detailModalOpen}
        handleClose={handleCloseDetailModal}
        orderId={selectedOrderId || ''}
        token={token || ''}
      />
    </>
  );
}
