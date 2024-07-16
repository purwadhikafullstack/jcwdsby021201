import { adminMutationMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import MutationTableWithHistory from '@/views/admin/mutations/MutationTableWithHistory';

export const metadata = adminMutationMetadata;

export default function MutationPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.mutation} />
      <MutationTableWithHistory />
    </>
  );
}
