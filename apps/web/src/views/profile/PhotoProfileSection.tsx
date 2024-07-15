import Image from 'next/image';
import * as React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

interface IPhotoProfileSectionProps {
  isLoading: boolean;
  data: any;
  handleOpenProfilePictureModal: () => void;
}

const PhotoProfileSection: React.FunctionComponent<
  IPhotoProfileSectionProps
> = ({
  isLoading,
  data,
  handleOpenProfilePictureModal,
}: IPhotoProfileSectionProps) => {
  return (
    <Grid item xs={12} display="flex" justifyContent="center">
      <Box>
        {isLoading ? (
          <Skeleton variant="circular" width={150} height={150} />
        ) : data ? (
          <Image
            src={
              data.image && data.image.startsWith('https')
                ? data.image
                : `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}${data.image || '/profile.jpg'}`
            }
            alt="Profile"
            width={150}
            height={150}
            style={{ borderRadius: '50%', cursor: 'pointer' }}
            onClick={handleOpenProfilePictureModal}
          />
        ) : (
          <Skeleton variant="circular" width={150} height={150} />
        )}
      </Box>
    </Grid>
  );
};

export default PhotoProfileSection;
