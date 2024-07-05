import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToShipTable from '@/components/table/ToShipOrder';
import { dashboardAdminPages, dashboardUserPages } from '@/utils/routes';

export default function ToShipPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.shipping} />
      <ToShipTable />
    </>
  );
}
