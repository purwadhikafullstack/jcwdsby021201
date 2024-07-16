import { dashboardToShipMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToShipTable from '@/components/table/ToShipOrder';
import { dashboardAdminPages, dashboardUserPages } from '@/utils/routes';


export const metadata = dashboardToShipMetadata;

export default function ToShipPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.shipping} />
      <ToShipTable />
    </>
  );
}
