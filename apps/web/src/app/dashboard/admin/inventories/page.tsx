import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import InventoryTable from '@/components/table/InventoryTable';

export default function InventoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.inventory} />
      <InventoryTable />
    </>
  );
}
