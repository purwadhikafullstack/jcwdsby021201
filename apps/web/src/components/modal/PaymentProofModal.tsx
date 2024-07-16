import * as React from 'react';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import UploadPictureForm from '../form/UploadPictureForm';

interface IPaymentProofModalProps {
  open: boolean;
  handleClose: () => void;
  orderId: number;
}

const PaymentProofModal: React.FunctionComponent<IPaymentProofModalProps> = ({
  open,
  handleClose,
  orderId,
}: IPaymentProofModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
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
          <UploadPictureForm
            handleClose={handleClose}
            orderId={orderId}
            type="paymentProof"
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default PaymentProofModal;
