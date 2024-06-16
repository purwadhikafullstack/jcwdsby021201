import { signIn } from '@/utils/auth';
import Image from 'next/image';
import Button from '@mui/material/Button';
import github from '@/public/icons/github.svg';

export default function GithubButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github');
      }}
    >
      <Button
        variant="outlined"
        type="submit"
        startIcon={<Image alt="Logo" src={github} height={25} width={25} />}
        sx={{ width: '100%' }}
      >
        Github
      </Button>
    </form>
  );
}
