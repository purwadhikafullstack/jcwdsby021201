import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { MutationFormUpdate } from '@/components/form/MutationForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export default function MutationUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs
        route={dashboardAdminPages.mutation}
        action="Update"
      />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <MutationFormUpdate />
      </Box>
    </>
  );
}
