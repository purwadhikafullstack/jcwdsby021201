import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { InventoryFormUpdate } from '@/components/form/InventoryForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export default function InventoryUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.inventory}
        action="Update"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <InventoryFormUpdate />
      </Box>
    </>
  );
}
