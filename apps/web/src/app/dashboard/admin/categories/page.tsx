import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CategoryTable from '@/components/table/CategoryTable';
import { dashboardAdminPages } from '@/utils/routes';

export default function CategoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.category} />
      <CategoryTable />
    </>
  );
}
