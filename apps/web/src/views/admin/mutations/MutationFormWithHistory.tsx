'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

// MRT
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Custom Components
import GeneralHistoryTable from '@/components/table/GeneralHistoryTable';
import { MutationFormUpdate } from '@/components/form/MutationForm';
import { useGetMutationHistoryById } from '@/features/admin/mutations/mutationsQueries';

export default function MutationFormWithHistory() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const params = useParams();
  const id = params.id as string;

  const props = useGetMutationHistoryById(
    id,
    globalFilter,
    pagination,
    sorting,
  );

  return (
    <>
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MutationFormUpdate />
      </Box>
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
