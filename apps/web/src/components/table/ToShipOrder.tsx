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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// React Query
import {
  useGetToShipOrder,
  useGetUnpaidOrder,
} from '@/features/user/order/orderQueries';
import { CobaResponse } from '@/features/user/order/type';
import {
  useCancelOrder,
  useReceiveOrder,
} from '@/features/user/order/orderMutation';

// Custom Components
import ConfirmationCancel from '../dialog/ConfirmationCancel';

// NextAuth
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import PaymentProofModal from '../modal/PaymentProofModal';
import { Button } from '@mui/material';
import ConfirmationReceived from '../dialog/ConfirmationReceived';
import Image from 'next/image';

export default function ToShipTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const [openReceivedDialog, setOpenReceivedDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleReceivedClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenReceivedDialog(true);
  };

  const { mutateAsync } = useReceiveOrder();
  const receiveOrder = async (orderId: string) => {
    try {
      if (token) {
        await mutateAsync({
          token,
          orderId,
        });
      }
      refetch();
      setOpenReceivedDialog(false);
    } catch (error) {}
  };

  const { data, isError, isPending, isRefetching, isLoading, refetch } =
    useGetToShipOrder(globalFilter, pagination, sorting, token || '');

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
        size: 300,
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
        }}
      >
        {user?.role === 'USER' && (
          <>
            <Tooltip title="received">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  borderRadius: '0px',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
                onClick={() => handleReceivedClick(row.original.id.toString())}
              >
                Received
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
      <ConfirmationReceived
        open={openReceivedDialog}
        onClose={() => setOpenReceivedDialog(false)}
        mutation={receiveOrder}
        isPending={isPending}
        orderId={selectedOrderId || ''}
      />
    </>
  );
}
