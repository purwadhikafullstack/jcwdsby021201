import { adminCategoryCreateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { CategoryFormCreate } from '@/components/form/CategoryForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminCategoryCreateMetadata;

export default function CategoryCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.category}
        action="Create"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <CategoryFormCreate />
      </Box>
    </>
  );
}
