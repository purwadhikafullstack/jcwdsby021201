import { Button, Grid, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import Link from 'next/link';

interface IAddressSectionProps {
  isLoading: boolean;
  primaryAddress: string;
}

const AddressSection: React.FunctionComponent<IAddressSectionProps> = ({
  isLoading,
  primaryAddress,
}: IAddressSectionProps) => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="inherit"
        component="h1"
        color="common.black"
        textAlign="left"
        fontSize={16}
      >
        Address
      </Typography>
      <Link href={'/dashboard/user/profile/address'}>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" />
        ) : primaryAddress ? (
          <Button
            sx={{
              fontWeight: 'bold',
              padding: '12px 16px',
              fontSize: '14px',
              textTransform: 'uppercase',
              ...buttonPrimaryStyles,
            }}
            fullWidth
          >
            {primaryAddress ? primaryAddress : 'Location'}
          </Button>
        ) : (
          <Skeleton variant="rectangular" width="100%" />
        )}
      </Link>
    </Grid>
  );
};

export default AddressSection;
