'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Carousel from 'react-material-ui-carousel';

const categories = [
  { name: 'Phones' },
  { name: 'Computers' },
  { name: 'SmartWatch' },
  { name: 'Camera' },
  { name: 'HeadPhones' },
  { name: 'Gaming' },
];

const CategoryButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.primary,
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const carouselImages = [
  '/images/carousel.webp',
  '/images/carousel1.jpg',
  '/images/carousel2.jpg',
  '/images/carousel3.jpg',
];

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Box display="flex" flexDirection="column" pl={6}>
            {categories.map((category) => (
              <CategoryButton
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                sx={{ mb: 1, justifyContent: 'flex-start' }}
              >
                {category.name}
              </CategoryButton>
            ))}
          </Box>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={12} md={8}>
          <Carousel>
            {carouselImages.map((image, index) => (
              <Box key={index}>
                <Image
                  src={image}
                  alt={`Carousel Image ${index + 1}`}
                  width={800}
                  height={400}
                />
              </Box>
            ))}
          </Carousel>
        </Grid>
      </Grid>
    </Container>
  );
}
