import { superAdminUserCreateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { UserFormCreate } from '@/components/form/UserForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = superAdminUserCreateMetadata;

export default function UserCreatePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.user} action="Create" />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <UserFormCreate />
      </Box>
    </>
  );
}
