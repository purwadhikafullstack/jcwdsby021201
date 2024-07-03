import { Backdrop, Box, Fade, Modal } from '@mui/material';
import * as React from 'react';
import ChangeUsernameForm from '../form/UpdateUsernameForm';

interface IUsernameModalUpdateProps {
  open: boolean;
  handleClose: () => void;
  initialUsername: string;
}

const UsernameModalUpdate: React.FunctionComponent<
  IUsernameModalUpdateProps
> = ({ open, handleClose, initialUsername }: IUsernameModalUpdateProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            p: 4,
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ChangeUsernameForm
            initialUsername={initialUsername}
            handleClose={handleClose}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default UsernameModalUpdate;
