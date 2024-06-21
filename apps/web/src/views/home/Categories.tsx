'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

const categories = [
  { name: 'Phones', icon: '/images/Category-CellPhone.png' },
  { name: 'Computers', icon: '/images/Category-Computer.png' },
  { name: 'SmartWatch', icon: '/images/Category-SmartWatch.png' },
  { name: 'Camera', icon: '/images/Category-Camera.png' },
  { name: 'HeadPhones', icon: '/images/Category-Headphone.png' },
  { name: 'Gaming', icon: '/images/Category-Gamepad.png' },
];

interface CategoryButtonProps {
  isSelected: boolean;
}

const CategoryButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<CategoryButtonProps>(({ theme, isSelected }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(2),
  color: isSelected ? theme.palette.common.white : theme.palette.text.primary,
  backgroundColor: isSelected
    ? theme.palette.error.main
    : theme.palette.common.white,
  '&:hover': {
    backgroundColor: isSelected
      ? theme.palette.error.main
      : theme.palette.grey[100],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 150,
  height: 150,
}));

export default function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);

  const itemsPerPage = {
    xs: 2,
    sm: 3,
    md: 3,
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(categories.length / itemsPerPage.md);
    if (page < maxPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const getVisibleCategories = () => {
    const startIndex = page * itemsPerPage.md;
    const endIndex = startIndex + itemsPerPage.md;
    return categories.slice(startIndex, endIndex);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Box bgcolor="error.main" width={10} height={30} mr={1} borderRadius="3px" />
        <Typography variant="h6" color="error">
          Categories
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Browse By Category
        </Typography>
        <Box display="flex">
          <IconButton onClick={handlePrevPage} disabled={page === 0}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={handleNextPage} disabled={page >= Math.ceil(categories.length / itemsPerPage.md) - 1}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {getVisibleCategories().map((category) => (
          <Grid item key={category.name}>
            <CategoryButton
              isSelected={selectedCategory === category.name}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Image
                src={category.icon}
                alt={category.name}
                width={50}
                height={50}
                style={{
                  filter:
                    selectedCategory === category.name ? 'invert(1)' : 'none',
                }}
              />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {category.name}
              </Typography>
            </CategoryButton>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
