import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import ProductTable from '@/components/table/ProductTable';

export default function ProductPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.product} />
      <ProductTable />
    </>
  );
}
