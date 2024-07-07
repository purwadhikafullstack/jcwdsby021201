import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  id?: string;
  action: 'cancel';
};

export default function ReasonDialog({
  open,
  onClose,
  mutateAsync,
  isMutatePending,
  id,
  action,
}: Props) {
  const handleDelete = () => {
    if (id) mutateAsync(id);
    onClose();
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogTitle>Dialog Confirmation</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography
          gutterBottom
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.error.light, 0.5),
            p: 2,
            borderRadius: 1,
          }}
        >
          Are you sure you want to <strong>{action.toUpperCase()}</strong> this
          item?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={isMutatePending}
          onClick={onClose}
          sx={{
            backgroundColor: (theme) => theme.palette.grey[500],
            color: 'white',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.grey[600],
            },
          }}
        >
          Back
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={isMutatePending}
        >
          yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
