import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';

interface ConfirmationCancelProps {
  open: boolean;
  onClose: () => void;
  mutation: (orderId: string) => Promise<void>;
  isPending: boolean;
  orderId: string;
}

const ConfirmationCancel: React.FC<ConfirmationCancelProps> = ({
  open,
  onClose,
  mutation,
  isPending,
  orderId,
}) => {
  const handleConfirm = async () => {
    await mutation(orderId);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Confirm Cancellation'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to cancel this order?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: 'black',
          }}
        >
          No
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          autoFocus
          disabled={isPending}
          sx={{
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
        >
          {isPending ? <CircularProgress size={24} /> : 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationCancel;
