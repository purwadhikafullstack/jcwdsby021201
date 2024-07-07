import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import UserTable from '@/components/table/UserTable';

export default function UserPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.user} />
      <UserTable />
    </>
  );
}
