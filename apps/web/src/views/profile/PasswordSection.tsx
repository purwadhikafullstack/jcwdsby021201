import { Button, Grid, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

interface IPasswordSectionProps {
  isLoading: boolean;
  data: any;
  handleOpenPasswordModal: () => void;
}

const PasswordSection: React.FunctionComponent<IPasswordSectionProps> = ({
  isLoading,
  data,
  handleOpenPasswordModal,
}) => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="inherit"
        component="h1"
        color="common.black"
        textAlign="left"
        fontSize={16}
      >
        Password
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" />
      ) : data ? (
        <Button
          sx={{
            fontWeight: 'bold',
            padding: '12px 16px',
            fontSize: '14px',
            textTransform: 'uppercase',
            ...buttonPrimaryStyles,
          }}
          fullWidth
          onClick={handleOpenPasswordModal}
        >
          {data?.password ? 'SECRET' : 'SECRET'}
        </Button>
      ) : (
        <Skeleton variant="rectangular" width="100%" />
      )}
    </Grid>
  );
};

export default PasswordSection;
