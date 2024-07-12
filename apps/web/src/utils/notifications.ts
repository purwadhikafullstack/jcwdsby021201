import axios from 'axios';
import toast from 'react-hot-toast';

export const errorFetcherNotification = (error: any) => {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.message || error.message || 'Something went wrong',
      { style: { border: '1px solid #f44336' } },
    );
  }
};

export const errorNotification = (message: string | JSX.Element) => {
  toast.error(message || 'Something went wrong', {
    style: { border: '1px solid #f44336' },
  });
};

export const successNotification = (message: string) => {
  toast.success(message || 'Something went wrong', {
    style: { border: '1px solid #66bb6a' },
  });
};

export const infoNotification = (message: string) => {
  toast(message || 'Information', {
    style: {
      border: '1px solid #000080',
      color: 'white',
      backgroundColor: '#000080',
    },
  });
};
