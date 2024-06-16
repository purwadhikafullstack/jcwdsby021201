import { signIn } from '@/utils/auth';
import Image from 'next/image';
import Button from '@mui/material/Button';
import discord from '@/public/icons/discord.svg';

export default function DiscordButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('discord');
      }}
    >
      <Button
        variant="outlined"
        type="submit"
        startIcon={<Image alt="Logo" src={discord} height={20} width={20} />}
        sx={{ width: '100%' }}
      >
        Discord
      </Button>
    </form>
  );
}
