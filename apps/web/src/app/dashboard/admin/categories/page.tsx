import Link from 'next/link';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CategoryTable from '@/components/table/CategoryTable';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';
import LinkButton from '@/components/button/LinkButton';

export default function CategoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.category} />
      <LinkButton
        href={dashboardAdminPages.category.path + '/create'}
        variant="create"
      >
        Category
      </LinkButton>
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <CategoryTable />
      </Box>
    </>
  );
}
