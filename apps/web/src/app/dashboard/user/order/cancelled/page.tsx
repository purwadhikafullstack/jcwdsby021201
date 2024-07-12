import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CancelledTable from '@/components/table/CancelledTable';
import { dashboardUserPages } from '@/utils/routes';

export default function ToCancelPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.cancelled} />
      <CancelledTable />
    </>
  );
}
