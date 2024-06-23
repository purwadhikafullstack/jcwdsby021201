import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { ProductFormCreate } from '@/components/form/ProductForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export default function ProductCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.product}
        action="Create"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <ProductFormCreate />
      </Box>
    </>
  );
}
