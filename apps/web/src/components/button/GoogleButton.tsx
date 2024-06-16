import { signIn } from '@/utils/auth';
import Image from 'next/image';
import Button from '@mui/material/Button';
import google from '@/public/icons/google.svg';

export default function GoogleButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button
        variant="outlined"
        type="submit"
        startIcon={<Image alt="Logo" src={google} height={20} width={20} />}
        sx={{ width: '100%' }}
      >
        Google
      </Button>
    </form>
  );
}
