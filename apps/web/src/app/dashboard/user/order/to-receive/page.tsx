import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToReceiveTable from '@/components/table/ToReceiveOrder';
import { dashboardUserPages } from '@/utils/routes';

export default function ToReceivePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.receive} />
      <ToReceiveTable />
    </>
  );
}
