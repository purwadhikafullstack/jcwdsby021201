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
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

interface ConfirmationReceivedProps {
  open: boolean;
  onClose: () => void;
  mutation: (orderId: string) => Promise<void>;
  isPending: boolean;
  orderId: string;
}

const ConfirmationReceived: React.FC<ConfirmationReceivedProps> = ({
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
          Are you sure you want to accept this order? Once accepted, the order
          will be processed and cannot be undone.
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
          autoFocus
          disabled={isPending}
          sx={{
            ...buttonPrimaryStyles,
          }}
        >
          {isPending ? <CircularProgress size={24} /> : 'Yes, Accept Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationReceived;
