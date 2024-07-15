import { Button, Grid, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

interface IEmailSectionProps {
  isLoading: boolean;
  data: any;
  handleOpenEmailModal: () => void;
}

const EmailSection: React.FunctionComponent<IEmailSectionProps> = ({
  isLoading,
  data,
  handleOpenEmailModal,
}: IEmailSectionProps) => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="inherit"
        component="h1"
        color="common.black"
        textAlign="left"
        fontSize={16}
      >
        Email
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" />
      ) : data?.email ? (
        <Button
          sx={{
            fontWeight: 'bold',
            padding: '12px 16px',
            fontSize: '14px',
            textTransform: 'uppercase',
            ...buttonPrimaryStyles,
          }}
          onClick={handleOpenEmailModal}
          fullWidth
        >
          {' '}
          {data?.email}
        </Button>
      ) : (
        <Skeleton variant="rectangular" width="100%" />
      )}
    </Grid>
  );
};

export default EmailSection;
