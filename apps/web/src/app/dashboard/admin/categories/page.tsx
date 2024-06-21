import Link from 'next/link';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CategoryListTable from '@/components/table/CategoryListTable';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function CategoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.category} />
      <Link href={dashboardAdminPages.category.path + '/create'} passHref>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Category
        </Button>
      </Link>
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <CategoryListTable />
      </Box>
    </>
  );
}
