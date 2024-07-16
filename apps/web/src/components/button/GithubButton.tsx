'use client';

import Image from 'next/image';

// MUI Components
import Button from '@mui/material/Button';

// Image
import github from '@/public/icons/github.svg';

type Props = {
  handleSignIn: () => void;
  disabled?: boolean;
};

export default function GithubButton({ handleSignIn, disabled }: Props) {
  return (
    <Button
      onClick={handleSignIn}
      variant="outlined"
      type="button"
      disabled={disabled}
      startIcon={
        <Image alt="Logo Github" src={github} height={25} width={25} />
      }
      sx={{ width: '100%' }}
    >
      Github
    </Button>
  );
}
