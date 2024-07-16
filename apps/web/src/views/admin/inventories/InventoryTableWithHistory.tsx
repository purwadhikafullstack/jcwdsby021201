'use client';

import { useState } from 'react';
// MRT
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Custom Components
import GeneralHistoryTable from '@/components/table/GeneralHistoryTable';
import InventoryTable from '@/components/table/InventoryTable';
import { useGetInventoryHistory } from '@/features/admin/inventories/inventoriesQueries';

export default function InventoryTableWithHistory() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const props = useGetInventoryHistory(globalFilter, pagination, sorting);

  return (
    <>
      <InventoryTable />
      <Box sx={{ maxWidth: '100%', my: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          History
        </Typography>
        <GeneralHistoryTable
          {...props}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Box>
    </>
  );
}
