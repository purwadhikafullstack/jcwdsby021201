'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Box,
  Select,
  MenuItem,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '@/components/core/Logo';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetCountProductCart } from '@/features/user/cart/cartQueries';
import { useRouter } from 'next/navigation';

const LanguageSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.common.white,
  '& .MuiSelect-icon': {
    color: theme.palette.common.white,
  },
}));

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function Navbar() {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

  const { data } = useGetCountProductCart(token || '');

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const mobileMenu = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={Link} href="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} href="/contact">
          <ListItemText primary="Contact" />
        </ListItem>
        <ListItem button component={Link} href="/about">
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Sign Up" />
        </ListItem>
        <ListItem button>
          <FavoriteIcon />
        </ListItem>
        <ListItem button>
          <Badge badgeContent={4} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'black',
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="body1" color="inherit">
            Summer Sale For All Xiaomi Devices And Free Express Delivery - OFF
            50%!
          </Typography>
          <LanguageSelect
            value="english"
            onChange={() => {}}
            sx={{ marginLeft: 'auto' }}
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="french">French</MenuItem>
          </LanguageSelect>
        </Toolbar>
      </AppBar>
      <AppBar
        position="static"
        color="inherit"
        sx={{ marginTop: '2px', display: { xs: 'none', md: 'flex' } }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo />
          <div>
            <Link href="/" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>
                Home
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>
                Contact
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>
                About
              </Button>
            </Link>
            <Button sx={{ textTransform: 'capitalize', color: 'black' }}>
              Sign Up
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="What are you looking for?"
                inputProps={{ 'aria-label': 'search' }}
              />
            </SearchContainer>
            <IconButton color="inherit">
              <FavoriteIcon />
            </IconButton>
            <IconButton color="inherit">
              <Badge
                onClick={() => router.push('/cart')}
                badgeContent={data?.count ? data.count : '0'}
                color="secondary"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <AppBar
        position="static"
        color="inherit"
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleSearchToggle}>
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{ alignSelf: 'flex-end', p: 2 }}
        >
          <CloseIcon />
        </IconButton>
        {mobileMenu}
      </Drawer>

      <Drawer anchor="top" open={searchOpen} onClose={handleSearchToggle}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <StyledInputBase
            placeholder="What are you looking for?"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
