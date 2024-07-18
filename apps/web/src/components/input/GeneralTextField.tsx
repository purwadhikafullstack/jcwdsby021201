import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

// MUI Components
import TextField from '@mui/material/TextField';

// React Hook Form
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';

interface GeneralTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  shrink?: boolean;
  multiline?: boolean;
  minRows?: number;
  additionalOnChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function GeneralTextField<T extends FieldValues>({
  control,
  name,
  required,
  type,
  label,
  placeholder,
  disabled,
  shrink,
  multiline,
  minRows,
  additionalOnChange,
}: GeneralTextFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField
      fullWidth
      required={required}
      type={type}
      size="small"
      label={label}
      variant="outlined"
      placeholder={placeholder}
      disabled={disabled}
      helperText={error?.message}
      error={Boolean(error)}
      InputLabelProps={{ shrink, required }}
      multiline={multiline}
      minRows={minRows}
      {...field}
      onChange={(e) => {
        if (additionalOnChange) additionalOnChange(e);
        field.onChange(e.target.value);
      }}
    />
  );
}
