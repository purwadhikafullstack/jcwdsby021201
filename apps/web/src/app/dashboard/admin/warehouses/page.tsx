import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import WarehouseTable from '@/components/table/WarehouseTable';

export default function WarehousePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.warehouse} />
      <WarehouseTable />
    </>
  );
}
