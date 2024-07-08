import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import InventoryTableWithHistory from '@/views/admin/inventories/InventoryTableWithHistory';

export default function InventoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.inventory} />
      <InventoryTableWithHistory />
    </>
  );
}
