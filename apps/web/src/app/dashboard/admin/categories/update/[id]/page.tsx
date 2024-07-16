import { adminCategoryUpdateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { CategoryFormUpdate } from '@/components/form/CategoryForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminCategoryUpdateMetadata;

export default function CategoryUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.category}
        action="Update"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <CategoryFormUpdate />
      </Box>
    </>
  );
}
