import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import InventoryFormWithHistory from '@/views/admin/inventories/InventoryFormWithHistory';

export default function InventoryUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.inventory}
        action="Update"
      />
      <InventoryFormWithHistory />
    </>
  );
}
