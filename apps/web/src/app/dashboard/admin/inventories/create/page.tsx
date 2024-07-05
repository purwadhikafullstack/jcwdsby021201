import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { InventoryFormCreate } from '@/components/form/InventoryForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export default function InventoryCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.inventory}
        action="Create"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <InventoryFormCreate />
      </Box>
    </>
  );
}
