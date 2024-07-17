import { useState } from 'react';

// MUI Components
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// React Hook Form
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

interface GeneralInputPasswordProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  required?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  shrink?: boolean;
}

export default function GeneralInputPassword<T extends FieldValues>({
  control,
  name,
  required,
  label,
  placeholder,
  disabled,
  shrink,
}: GeneralInputPasswordProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField
      fullWidth
      required={required}
      type={showPassword ? 'text' : 'password'}
      size="small"
      label={label}
      variant="outlined"
      placeholder={placeholder}
      disabled={disabled}
      helperText={error?.message}
      error={Boolean(error)}
      InputLabelProps={{ shrink, required }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        ),
      }}
      {...field}
    />
  );
}
