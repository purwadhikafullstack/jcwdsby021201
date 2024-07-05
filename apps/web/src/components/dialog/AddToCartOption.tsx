import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddToCartConfirmationProps {
  open: boolean;
  onClose: () => void;
  goToCart: () => void;
}

const AddToCartConfirmation: React.FC<AddToCartConfirmationProps> = ({
  open,
  onClose,
  goToCart,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id="alert-dialog-title">
          {'Product Added to Cart'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The product has been added to your cart. What would you like to do
            next?
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={onClose}
              color="primary"
              sx={{ mr: 1, color: 'black' }}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={goToCart}
              color="primary"
              variant="contained"
              sx={{ backgroundColor: 'black', borderRadius: '0px' }}
            >
              Go to Cart
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddToCartConfirmation;
