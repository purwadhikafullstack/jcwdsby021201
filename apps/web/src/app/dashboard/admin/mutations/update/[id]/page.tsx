import { adminMutationWarehouseUpdateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import MutationFormWithHistory from '@/views/admin/mutations/MutationFormWithHistory';

export const metadata = adminMutationWarehouseUpdateMetadata;

export default function MutationUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.mutation}
        action="Update"
      />
      <MutationFormWithHistory />
    </>
  );
}
