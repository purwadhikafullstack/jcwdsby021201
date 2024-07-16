import { adminProductUpdateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { ProductFormUpdate } from '@/components/form/ProductForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminProductUpdateMetadata;

export default function ProductUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.product}
        action="Update"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <ProductFormUpdate />
      </Box>
    </>
  );
}
