import { adminCategoryMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CategoryTable from '@/components/table/CategoryTable';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminCategoryMetadata;

export default function CategoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.category} />
      <Box sx={{ maxWidth: '100%', pb: 2 }}>
        <CategoryTable />
      </Box>
    </>
  );
}
