'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  href: string;
  children: React.ReactNode;
  variant: 'create' | 'back';
  disabled?: boolean;
};

export default function LinkButton({
  children,
  href,
  variant,
  disabled,
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };
  return (
    <>
      {variant === 'create' && (
        <Button
          onClick={handleClick}
          disabled={disabled}
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          sx={{
            mt: 2,
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '0',
            borderColor: 'black',
            '&:hover': {
              backgroundColor: '#333333',
              color: 'white',
            },
          }}
        >
          {children}
        </Button>
      )}
      {variant === 'back' && (
        <Button
          onClick={handleClick}
          disabled={disabled}
          variant="contained"
          sx={{
            borderRadius: '0',
            backgroundColor: (theme) => theme.palette.grey[500],
            color: 'white',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.grey[600],
            },
          }}
        >
          {children}
        </Button>
      )}
    </>
  );
}
