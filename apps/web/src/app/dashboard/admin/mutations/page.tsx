import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import MutationTable from '@/components/table/MutationTable';

export default function InventoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.mutation} />
      <MutationTable />
    </>
  );
}
