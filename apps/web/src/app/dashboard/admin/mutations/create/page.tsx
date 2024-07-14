import { adminMutationWarehouseCreateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { MutationFormCreate } from '@/components/form/MutationForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = adminMutationWarehouseCreateMetadata;

export default function MutationCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.mutation}
        action="Create"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MutationFormCreate />
      </Box>
    </>
  );
}
