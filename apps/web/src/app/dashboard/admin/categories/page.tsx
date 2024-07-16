import { adminCategoryMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import CategoryTable from '@/components/table/CategoryTable';
import { dashboardAdminPages } from '@/utils/routes';

export const metadata = adminCategoryMetadata;

export default function CategoryPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.category} />
      <CategoryTable />
    </>
  );
}
