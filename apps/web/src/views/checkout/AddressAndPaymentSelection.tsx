import * as React from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { common } from '@mui/material/colors';
import AddressForm from '@/components/form/AddAddressForm';
import Image from 'next/image';
import mandiriLogo from '@/public/icons/mandiri.webp';
import bcaLogo from '@/public/icons/bca.png';
import briLogo from '@/public/icons/bri.png';
import bniLogo from '@/public/icons/bni.png';
import gopayLogo from '@/public/icons/GOPAY.png';
import ovoLogo from '@/public/icons/OVO.png';

interface Address {
  id: number;
  address: string;
}

interface IAddressAndPaymentSelectionProps {
  selectedAddressId: number;
  paymentMethod: string;
  dataAddress: any;
  handleAddressChange: (event: SelectChangeEvent<number | string>) => void;
  setPaymentMethod: (method: string) => void;
  setShowAddressForm: (show: boolean) => void;
  refreshAddresses: () => void;
  showAddressForm: boolean;
}

const AddressAndPaymentSelection: React.FunctionComponent<
  IAddressAndPaymentSelectionProps
> = ({
  selectedAddressId,
  paymentMethod,
  dataAddress,
  handleAddressChange,
  setPaymentMethod,
  setShowAddressForm,
  refreshAddresses,
  showAddressForm,
}: IAddressAndPaymentSelectionProps) => {
  const onAddressChange = (event: SelectChangeEvent<number | string>) => {
    if (event.target.value === 'add_address') {
      setShowAddressForm(true);
    } else {
      handleAddressChange(event);
    }
  };
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography>Select Address:</Typography>
        <Select value={selectedAddressId} onChange={onAddressChange} fullWidth>
          {dataAddress?.map((address: any) => (
            <MenuItem key={address.id} value={address.id}>
              {address.address}
            </MenuItem>
          ))}
          <MenuItem
            value={'add_address'}
            sx={{ textAlign: 'center', width: '100%' }}
          >
            Add New Address
          </MenuItem>
        </Select>
      </Grid>
      {showAddressForm && (
        <Grid item xs={12} sx={{ position: 'relative' }}>
          <Button
            variant="outlined"
            onClick={() => setShowAddressForm(false)}
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'black',
              borderRadius: 0,
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                borderColor: 'black',
              },
            }}
          >
            Cancel Add Address
          </Button>
          <AddressForm
            shouldRedirect={false}
            onAddressAdded={refreshAddresses}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography>Select Payment Method:</Typography>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
        >
          <MenuItem value="mandiri">
            <Image
              src={mandiriLogo}
              alt="Mandiri"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            Bank Mandiri
          </MenuItem>
          <MenuItem value="bca">
            <Image
              src={bcaLogo}
              alt="BCA"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            Bank BCA
          </MenuItem>
          <MenuItem value="bri">
            <Image
              src={briLogo}
              alt="BRI"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            Bank BRI
          </MenuItem>
          <MenuItem value="bni">
            <Image
              src={bniLogo}
              alt="BNI"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            Bank BNI
          </MenuItem>
          <MenuItem value="gopay">
            <Image
              src={gopayLogo}
              alt="GoPay"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            Go-Pay
          </MenuItem>
          <MenuItem value="ovo">
            <Image
              src={ovoLogo}
              alt="OVO"
              width="68"
              height="20"
              style={{ marginRight: '20px' }}
            />
            OVO
          </MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default AddressAndPaymentSelection;
