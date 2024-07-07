import * as React from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import AddressForm from '@/components/form/AddAddressForm';

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
          <MenuItem value={'add_address'}>Add New Address</MenuItem>
        </Select>
      </Grid>
      {showAddressForm && (
        <Grid item xs={12}>
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
          <MenuItem value="mandiri">Bank Mandiri</MenuItem>
          <MenuItem value="bca">Bank BCA</MenuItem>
          <MenuItem value="bri">Bank BRI</MenuItem>
          <MenuItem value="bni">Bank BNI</MenuItem>
          <MenuItem value="gopay">Go-Pay</MenuItem>
          <MenuItem value="ovo">OVO</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default AddressAndPaymentSelection;
