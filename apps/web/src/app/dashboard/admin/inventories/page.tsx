import { adminInventoryMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import InventoryTableWithHistory from '@/views/admin/inventories/InventoryTableWithHistory';

export const metadata = adminInventoryMetadata;

export default function InventoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.inventory} />
      <InventoryTableWithHistory />
    </>
  );
}
