import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
export interface IConfirmationDeleteAddressProps {
  open: boolean;
  onClose: () => void;
  mutation: (addressId: string) => Promise<void>;
  isPending: boolean;
  addressId: string;
}

export function ConfirmationDeleteAddress({
  open,
  onClose,
  mutation,
  isPending,
  addressId,
}: IConfirmationDeleteAddressProps) {
  const handleConfirm = async () => {
    await mutation(addressId);
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
          Are you sure you want to delete this Address?
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
}
