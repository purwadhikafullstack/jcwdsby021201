'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';

// MUI Icons
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { SxProps, alpha } from '@mui/material/styles';

// Custom Components
import Logo from '@/components/core/Logo';
import {
  authPages,
  dashboardAdminPages,
  dashboardUserPages,
} from '@/utils/routes';
import SimpleBar from 'simplebar-react';

// NextAuth
import { useSession, signOut } from 'next-auth/react';
import { UserSession } from '@/features/types';
import Footer from '@/components/core/Footer';

const stickyBox: SxProps = {
  pl: 2,
  py: 1.4,
  borderBottom: '1px solid #e0e0e0',
  position: 'sticky',
  top: 0,
  zIndex: 9999,
  bgcolor: 'white',
};

const settings = ['Profile', 'Account', 'Dashboard'];

const menuSuperAdmin = [
  dashboardAdminPages.user,
  dashboardAdminPages.warehouse,
  dashboardAdminPages.category,
  dashboardAdminPages.product,
  dashboardAdminPages.inventory,
  dashboardAdminPages.mutation,
];

const menuWarehouseAdmin = [
  dashboardAdminPages.category,
  dashboardAdminPages.product,
  dashboardAdminPages.inventory,
  dashboardAdminPages.mutation,
];

const menuUser = [
  dashboardUserPages.purchases,
  dashboardUserPages.shipping,
  dashboardUserPages.receive,
  dashboardUserPages.profile,
  dashboardUserPages.myAddress,
];

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const userImage =
    `${process.env.NEXT_PUBLIC_BASE_API_URL}${user?.image}` || '';

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={stickyBox}>
        <Logo />
      </Box>
      <List dense={true}>
        {user?.role === 'SUPER_ADMIN' &&
          menuSuperAdmin.map((menu, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => router.push(menu.path)}
              sx={{
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  {<menu.Icon sx={{ fontSize: '18px' }} />}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        {user?.role === 'ADMIN' &&
          menuWarehouseAdmin.map((menu, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => router.push(menu.path)}
              sx={{
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  {<menu.Icon sx={{ fontSize: '18px' }} />}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        {user?.role === 'USER' &&
          menuUser.map((menu, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => router.push(menu.path)}
              sx={{
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                },
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  {<menu.Icon sx={{ fontSize: '18px' }} />}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: '#e0e0e0',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="primary"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.username} src={userImage} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
                <MenuItem>
                  <Typography
                    textAlign="center"
                    onClick={() =>
                      signOut({ callbackUrl: authPages.login.path })
                    }
                  >
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <SimpleBar style={{ maxHeight: '100%', overflowX: 'hidden' }}>
          {DrawerList}
        </SimpleBar>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: '#fafafa',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ minHeight: '100vh', maxWidth: '100vw', pt: 10 }}
        >
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}
