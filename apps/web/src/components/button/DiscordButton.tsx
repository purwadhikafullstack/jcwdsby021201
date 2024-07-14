'use client';

import Image from 'next/image';

// MUI Components
import Button from '@mui/material/Button';

// Image
import discord from '@/public/icons/discord.svg';

type Props = {
  handleSignIn: () => void;
  disabled?: boolean;
};

export default function DiscordButton({ handleSignIn, disabled }: Props) {
  return (
    <Button
      onClick={handleSignIn}
      variant="outlined"
      type="button"
      disabled={disabled}
      startIcon={
        <Image alt="Logo Discord" src={discord} height={20} width={20} />
      }
      sx={{ width: '100%' }}
    >
      Discord
    </Button>
  );
}
