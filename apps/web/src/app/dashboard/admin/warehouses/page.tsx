import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import WarehouseTable from '@/components/table/WarehouseTable';
import { adminWarehouseMetadata } from '@/app/meta-tag';
import Box from '@mui/material/Box';

export const metadata = adminWarehouseMetadata;

export default function WarehousePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.warehouse} />
      <Box sx={{ maxWidth: '100%', py: 2 }}>
        <WarehouseTable />
      </Box>
    </>
  );
}
