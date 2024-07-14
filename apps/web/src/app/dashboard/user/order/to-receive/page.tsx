import { dashboardToReceiveMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToReceiveTable from '@/components/table/ToReceiveOrder';
import { dashboardUserPages } from '@/utils/routes';

export const metadata = dashboardToReceiveMetadata;

export default function ToReceivePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.receive} />
      <ToReceiveTable />
    </>
  );
}
