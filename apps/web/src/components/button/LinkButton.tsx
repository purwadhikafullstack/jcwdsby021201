'use client';

import Link from 'next/link';
import React from 'react';

// MUI Icons
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

// Styles
import { buttonBackStyles, buttonPrimaryStyles } from '@/styles/buttonStyles';

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
    <>
      {variant === 'create' && (
        <Button
          LinkComponent={Link}
          href={href}
          disabled={disabled}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 2, ...buttonPrimaryStyles }}
        >
          {children}
        </Button>
      )}
      {variant === 'back' && (
        <Button
          LinkComponent={Link}
          href={href}
          disabled={disabled}
          variant="contained"
          sx={buttonBackStyles}
        >
          {children}
        </Button>
      )}
    </>
  );
}
