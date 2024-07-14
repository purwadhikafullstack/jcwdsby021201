import { adminWarehouseCreateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { WarehouseFormCreate } from '@/components/form/WarehouseForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminWarehouseCreateMetadata;

export default function WarehouseCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.warehouse}
        action="Create"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <WarehouseFormCreate />
      </Box>
    </>
  );
}
