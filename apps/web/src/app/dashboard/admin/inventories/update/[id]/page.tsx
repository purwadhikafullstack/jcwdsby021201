import { adminInventoryUpdateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import InventoryFormWithHistory from '@/views/admin/inventories/InventoryFormWithHistory';

export const metadata = adminInventoryUpdateMetadata;

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
