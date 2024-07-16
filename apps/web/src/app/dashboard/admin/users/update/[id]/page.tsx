import { superAdminUserUpdateMetadata } from '@/app/meta-tag';
import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { UserFormUpdate } from '@/components/form/UserForm';
import { dashboardAdminPages } from '@/utils/routes';
import Box from '@mui/material/Box';

export const metadata = superAdminUserUpdateMetadata;

export default function UserUpdatePage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.user} action="Update" />
      <Box sx={{ maxWidth: '100%', mt: 2 }}>
        <UserFormUpdate />
      </Box>
    </>
  );
}
