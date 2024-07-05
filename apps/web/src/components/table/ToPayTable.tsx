'use client';

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
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// React Query
import { useGetUnpaidOrder } from '@/features/user/order/orderQueries';
import { CobaResponse } from '@/features/user/order/type';
import { useCancelOrder } from '@/features/user/order/orderMutation';

// Custom Components
import ConfirmationCancel from '../dialog/ConfirmationCancel';

// NextAuth
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import PaymentProofModal from '../modal/PaymentProofModal';
import Image from 'next/image';
import StyledButton from '../button/StyledButton';
import { Button } from '@mui/material';

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

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentProofModal, setPaymentProofModal] = useState(false);

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
    return `IDR ${tot.toLocaleString()}`;
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
  const columns = useMemo<MRT_ColumnDef<CobaResponse>[]>(
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
        size: 200,
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
                  backgroundColor: 'black',
                  borderRadius: '0px',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
                onClick={() =>
                  handleOpenPaymentProofModal(row.original.id.toString())
                }
              >
                PaymentProof
              </Button>
            </Tooltip>
            <Tooltip title="Cancel Order">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  borderRadius: '0px',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
                onClick={() => handleCancelClick(row.original.id.toString())}
              >
                Cancel Order
              </Button>
            </Tooltip>
          </>
        )}
      </Box>
    ),
    positionActionsColumn: 'last',
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
    </>
  );
}
