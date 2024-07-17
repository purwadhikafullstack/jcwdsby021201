import DashboardBreadcrumbs from '@/components/core/DashboardBreadcrumbs';
import { dashboardAdminPages } from '@/utils/routes';
import UserTable from '@/components/table/UserTable';
import { adminUserMetadata } from '@/app/meta-tag';
import Box from '@mui/material/Box';

export const metadata = adminUserMetadata;

export default function UserPage() {
  return (
    <>
      <DashboardBreadcrumbs route={dashboardAdminPages.user} />
      <Box sx={{ maxWidth: '100%', pt: 2 }}>
        <UserTable />
      </Box>
    </>
  );
}
