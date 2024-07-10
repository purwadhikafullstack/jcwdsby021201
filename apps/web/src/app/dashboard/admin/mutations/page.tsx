import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import MutationTableWithHistory from '@/views/admin/mutations/MutationTableWithHistory';

export default function MutationPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.mutation} />
      <MutationTableWithHistory />
    </>
  );
}
