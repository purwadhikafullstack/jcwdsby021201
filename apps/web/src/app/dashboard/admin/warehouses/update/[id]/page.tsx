import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { WarehouseFormUpdate } from '@/components/form/WarehouseForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export default function WarehouseUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.warehouse}
        action="Update"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <WarehouseFormUpdate />
      </Box>
    </>
  );
}
