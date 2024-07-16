'use client';
import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Rating, IconButton } from '@mui/material';
import Image from 'next/image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const products = [
  {
    name: 'CANON EOS DSLR Camera',
    image: '/images/eos-250d-03-500x500 1.png',
    price: 'Rp 3,500,000',
    rating: 4.5,
  },
  {
    name: 'RGB liquid CPU Cooler',
    image: '/images/gammaxx-l240-argb-1-500x500 1.png',
    price: 'Rp 1,500,000',
    rating: 4.8,
  },
  {
    name: 'GP11 Shooter USB Gamepad',
    image: '/images/GP11_PRD3 1.png',
    price: 'Rp 250,000',
    rating: 4.2,
  },
  {
    name: 'ASUS FHD Gaming Laptop',
    image: '/images/ideapad-gaming-3i-01-500x500 1.png',
    price: 'Rp 12,500,000',
    rating: 4.7,
  },
  {
    name: 'AK-900 Wired Keyboard',
    image: '/images/ak-900-01-500x500 1.png',
    price: 'Rp 500,000',
    rating: 4.3,
  },
  {
    name: 'IPS LCD Gaming Monitor',
    image: '/images/g27cq4-500x500 1.png',
    price: 'Rp 3,800,000',
    rating: 4.6,
  },
  {
    name: 'HAVIT HV-G92 Gamepad',
    image: '/images/g92-2-500x500 1.png',
    price: 'Rp 350,000',
    rating: 4.1,
  },
  {
    name: 'Havic HV G-92 Gamepad',
    image: '/images/image 59.png',
    price: 'Rp 400,000',
    rating: 4.4,
  },
];

const itemsPerPage = {
  xs: 1,
  sm: 2,
  md: 4,
};

export default function ProductSection() {
  const [liked, setLiked] = useState(Array(products.length).fill(false));
  const [page, setPage] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerPage.md);

  const handleLike = (index: any) => {
    const updatedLiked = [...liked];
    updatedLiked[index] = !updatedLiked[index];
    setLiked(updatedLiked);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(products.length / itemsToShow) - 1));
  };

  const displayedProducts = products.slice(page * itemsToShow, page * itemsToShow + itemsToShow);

  React.useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 600) {
        setItemsToShow(itemsPerPage.xs);
      } else if (window.innerWidth < 960) {
        setItemsToShow(itemsPerPage.sm);
      } else {
        setItemsToShow(itemsPerPage.md);
      }
    };

    window.addEventListener('resize', updateItemsToShow);
    updateItemsToShow();

    return () => {
      window.removeEventListener('resize', updateItemsToShow);
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Box bgcolor="error.main" width={10} height={30} mr={1} borderRadius="3px" />
        <Typography variant="h6" color="error">
          Our Products
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Explore Our Products
        </Typography>
        <Box display="flex">
          <IconButton onClick={handlePrevPage} disabled={page === 0}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={handleNextPage} disabled={page === Math.ceil(products.length / itemsToShow) - 1}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {displayedProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 2,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <Image src={product.image} alt={product.name} width={100} height={100} />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: liked[index] ? 'error.main' : 'text.disabled',
                }}
                onClick={() => handleLike(index)}
              >
                {liked[index] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                {product.price}
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                <Rating name="read-only" value={product.rating} readOnly precision={0.5} size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.rating})
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
