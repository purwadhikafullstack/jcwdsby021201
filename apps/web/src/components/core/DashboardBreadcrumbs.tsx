import NextLink from 'next/link';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Route } from '@/utils/routes';

type Props = {
  action?: 'Create' | 'Update';
  route: Route;
};
export default function DashboardBreadcrumbs({ action, route }: Props) {
  const breadcrumbs = [
    <Typography key="1" color="inherit">
      Dashboard
    </Typography>,
    action ? (
      <Link
        component={NextLink}
        underline="hover"
        key="2"
        color="inherit"
        href={route.path}
      >
        {route.label}
      </Link>
    ) : (
      <Typography key="2" color="inherit">
        {route.label}
      </Typography>
    ),
    action && (
      <Typography key="3" color="inherit">
        {action}
      </Typography>
    ),
  ];
  return (
    <Box
      sx={{
        p: 2,
        background: 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 500, mt: 1 }}>
        {action ?? 'List'} {route.label}
      </Typography>
    </Box>
  );
}
