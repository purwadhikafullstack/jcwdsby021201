import Image from 'next/image';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// Dropzone
import { useDropzone } from 'react-dropzone';

// Mutations
import { useUploadProductImage } from '@/features/admin/products/productsMutations';

// Types
import { Pictures } from '@/features/admin/products/types';
import { UserSession } from '@/features/types';

// Styles
import {
  dropzoneContainerStyles,
  dropzoneThumbStyles,
} from '@/styles/dropzoneStyles';
import { errorNotification } from '@/utils/notifications';

const maxSize = 1 * 1024 * 1024;

type Props = {
  id?: string;
  files: Pictures[];
  setFiles: (data: any) => void;
  refetchQuery: any;
  disabled: boolean;
  handleDeleteFile: (id: number) => void;
  user: UserSession;
};

export default function ProductFormDropzone({
  id,
  refetchQuery,
  setFiles,
  disabled,
  files,
  handleDeleteFile,
  user,
}: Props) {
  const { mutateAsync: mutateUploadAsync } = useUploadProductImage();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    onDrop: async (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        return file.size <= maxSize;
      });

      if (id) {
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append('files', file);
        });

        await mutateUploadAsync({ id, formData });
        refetchQuery?.();
        return;
      }

      const newFiles = validFiles.map((file) => {
        return Object.assign(file, {
          id: Math.floor(Math.random() * 1000),
          preview: URL.createObjectURL(file),
        });
      });

      setFiles((prevFiles: any) => {
        const fixedFiles = [...prevFiles, ...newFiles];
        return fixedFiles;
      });
    },
    maxSize,
    disabled,
    onDropRejected: (files) => {
      files.forEach((file) => {
        if (file.errors.length > 0) {
          file.errors.forEach((err) => {
            if (err.code === 'file-too-large') {
              errorNotification('Max file size is 1MB');
            }
            if (err.code === 'file-invalid-type') {
              errorNotification('Invalid file type');
            }
          });
        }
      });
    },
  });

  const thumbs = files.map((file) => (
    <Box key={file.id} sx={dropzoneThumbStyles}>
      {user?.role === 'SUPER_ADMIN' && (
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteFile(file.id)}
          sx={{ position: 'absolute', zIndex: 1, top: -10, right: -10 }}
        >
          <DeleteIcon />
        </IconButton>
      )}
      <Image
        src={
          file.preview
            ? file.preview
            : `${process.env.NEXT_PUBLIC_BASE_API_URL}${file.url}`
        }
        alt={file.name}
        width={104}
        height={104}
        objectFit="cover"
      />
    </Box>
  ));

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          ...dropzoneContainerStyles,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon
          sx={{ fontSize: 50, color: (theme) => theme.palette.grey[600] }}
        />
        <Typography sx={{ color: (theme) => theme.palette.grey[600] }}>
          Drag & drop some files here, or click to select files
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: (theme) => theme.palette.grey[600] }}
        >
          (Only *.jpeg, *.jpg and *.png images will be accepted, max 1MB each)
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {thumbs}
      </Box>
    </Box>
  );
}
