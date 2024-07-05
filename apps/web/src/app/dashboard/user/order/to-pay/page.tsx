import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import ToPayTable from '@/components/table/ToPayTable';
import { dashboardAdminPages, dashboardUserPages } from '@/utils/routes';

export default function ToPayPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardUserPages.purchases} />
      <ToPayTable />
    </>
  );
}
