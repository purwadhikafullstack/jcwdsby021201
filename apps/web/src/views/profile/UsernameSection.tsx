import { Button, Grid, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

interface IUsernameSectionProps {
  isLoading: boolean;
  data: any;
  handleOpen: () => void;
}

const UsernameSection: React.FunctionComponent<IUsernameSectionProps> = ({
  isLoading,
  data,
  handleOpen,
}: IUsernameSectionProps) => {
  return (
    <Grid item xs={12}>
      <Typography
        variant="inherit"
        component="h1"
        color="common.black"
        textAlign="left"
        fontSize={16}
      >
        Username
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
          onClick={handleOpen}
          fullWidth
        >
          {' '}
          {data?.username ? data?.username : 'Choose username'}
        </Button>
      ) : (
        <Skeleton variant="rectangular" width="100%" />
      )}
    </Grid>
  );
};

export default UsernameSection;
