import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import UserTable from '@/components/table/UserTable';
import { adminUserMetadata } from '@/app/meta-tag';

export const metadata = adminUserMetadata;

export default function UserPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.user} />
      <UserTable />
    </>
  );
}
