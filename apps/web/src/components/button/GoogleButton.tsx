'use client';

import Image from 'next/image';

// MUI Components
import Button from '@mui/material/Button';

// Image
import google from '@/public/icons/google.svg';

type Props = {
  handleSignIn: () => void;
  disabled?: boolean;
};

export default function GoogleButton({ handleSignIn, disabled }: Props) {
  return (
    <Button
      onClick={handleSignIn}
      variant="outlined"
      type="button"
      disabled={disabled}
      startIcon={
        <Image alt="Logo Google" src={google} height={20} width={20} />
      }
      sx={{ width: '100%' }}
    >
      Google
    </Button>
  );
}
