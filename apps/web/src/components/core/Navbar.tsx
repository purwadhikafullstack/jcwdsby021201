'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  Badge,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from '@/components/core/Logo';
import Link from 'next/link';

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
    width: '20ch',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar() {
  return (
    <React.Fragment>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="body1" color="inherit">
            Summer Sale For All Xiaomi Devices And Free Express Delivery - OFF 50%!
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
      <AppBar position="static" color="inherit" sx={{ marginTop: '2px' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo />
          <div>
            <Link href="/" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>Home</Button>
            </Link>
            <Link href="/contact" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>Contact</Button>
            </Link>
            <Link href="/about" passHref>
              <Button sx={{ textTransform: 'capitalize', color: 'black' }}>About</Button>
            </Link>
            <Button sx={{ textTransform: 'capitalize', color: 'black' }}>Sign Up</Button>
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
              <Badge badgeContent={4} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
