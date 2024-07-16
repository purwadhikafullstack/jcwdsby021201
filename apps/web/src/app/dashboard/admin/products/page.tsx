import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import ProductTable from '@/components/table/ProductTable';
import { adminProductMetadata } from '@/app/meta-tag';

export const metadata = adminProductMetadata;

export default function ProductPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.product} />
      <ProductTable />
    </>
  );
}
