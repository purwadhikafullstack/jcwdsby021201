import * as React from 'react';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import UploadPictureForm from '../form/UploadPictureForm';

interface IProfileModalUpdateProps {
  open: boolean;
  handleClose: () => void;
}

const ProfileModalUpdate: React.FunctionComponent<IProfileModalUpdateProps> = ({
  open,
  handleClose,
}: IProfileModalUpdateProps) => {
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
          <UploadPictureForm handleClose={handleClose} type="profile" />
        </Box>
      </Fade>
    </Modal>
  );
};

export default ProfileModalUpdate;
