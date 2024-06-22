import React from 'react';
import Link from 'next/link';
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
  return (
    <Link href={href} passHref>
      {variant === 'create' && (
        <Button
          disabled={disabled}
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          {children}
        </Button>
      )}

      {variant === 'back' && (
        <Link href={href} passHref>
          <Button
            disabled={disabled}
            variant="contained"
            sx={{
              backgroundColor: (theme) => theme.palette.grey[500],
              color: 'white',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.grey[600],
              },
            }}
          >
            {children}
          </Button>
        </Link>
      )}
    </Link>
  );
}
