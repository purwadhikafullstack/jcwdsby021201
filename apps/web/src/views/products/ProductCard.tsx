import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { buttonPrimaryStyles, disabledStyles } from '@/styles/buttonStyles';

interface IProductCardProps {
  product: any;
  qty: number;
  isAuthenticated: string;
  verif: boolean | undefined;
  isProductInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => void;
  handleAddToCart: (productId: number) => void;
}

const ProductCard: React.FunctionComponent<IProductCardProps> = ({
  product,
  qty,
  isAuthenticated,
  verif,
  isProductInWishlist,
  toggleWishlist,
  handleAddToCart,
}: IProductCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        border: 'none',
        position: 'relative',
      }}
    >
      <Box>
        <CardMedia
          component="img"
          height="200"
          width="100"
          image={process.env.NEXT_PUBLIC_BASE_API_URL + product.pictures}
          alt={product.name}
          sx={{ objectFit: 'contain' }}
        />
        <IconButton
          onClick={() => toggleWishlist(product.id)}
          disabled={isAuthenticated === 'unauthenticated' || verif === false}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: isProductInWishlist(product.id) ? 'red' : 'black',
          }}
        >
          {isProductInWishlist(product.id) ? (
            <FavoriteIcon />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: 'black',
              }}
            />
          )}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 1,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            fontSize: '12px',
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: '12px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          IDR. {(product.price * qty).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          sx={{
            fontWeight: 'bold',
            padding: '12px 16px',
            fontSize: '14px',
            textTransform: 'uppercase',
            width: '100%',
            ...(isAuthenticated === 'unauthenticated' || verif === false
              ? disabledStyles
              : buttonPrimaryStyles),
          }}
          onClick={() => handleAddToCart(product.id)}
          disabled={isAuthenticated === 'unauthenticated' || verif === false}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
