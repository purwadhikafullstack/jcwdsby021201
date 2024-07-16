import { dashboardToPayMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToPayTable from '@/components/table/ToPayTable';
import { dashboardUserPages } from '@/utils/routes';

export const metadata = dashboardToPayMetadata;

export default function ToPayPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.purchases} />
      <ToPayTable />
    </>
  );
}
