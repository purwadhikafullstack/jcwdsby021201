import * as React from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
interface ICourierSelectionProps {
  courier: string;
  setCourier: (courier: string) => void;
}

const CourierSelection: React.FunctionComponent<ICourierSelectionProps> = ({
  courier,
  setCourier,
}: ICourierSelectionProps) => {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography>Select Courier:</Typography>
        <Select
          value={courier}
          onChange={(event: SelectChangeEvent<string>) =>
            setCourier(event.target.value)
          }
          fullWidth
        >
          <MenuItem value="jne">Jalur Nugraha Ekakurir (JNE)</MenuItem>
          <MenuItem value="pos">Pos Indonesia</MenuItem>
          <MenuItem value="tiki">TIKI</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default CourierSelection;
