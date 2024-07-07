import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import MutationTable from '@/components/table/MutationTable';

export default function MutationPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.mutation} />
      <MutationTable />
    </>
  );
}
