import { HTMLInputTypeAttribute, SyntheticEvent } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import { OptionLabel } from '@/features/types';

interface GeneralAutocompleteProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  options: OptionLabel[];
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  shrink?: boolean;
  additionalOnChange?: (e: SyntheticEvent, value: OptionLabel | null) => void;
  onInputChange?: (val: string) => void;
  isRefetching?: boolean;
}

export default function GeneralAutocomplete<T extends FieldValues>({
  control,
  name,
  options,
  required,
  type,
  label,
  placeholder,
  disabled,
  shrink,
  additionalOnChange,
  onInputChange,
  isRefetching,
}: GeneralAutocompleteProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <Autocomplete
      openOnFocus
      disabled={disabled}
      options={options}
      getOptionLabel={(option) => option.name}
      onChange={(_, value) => {
        if (additionalOnChange) {
          additionalOnChange(_, value);
        }
        field.onChange(value?.id ?? null);
      }}
      value={field.value ? options.find((opt) => opt.id === field.value) : null}
      onInputChange={(_, newInputValue) => {
        onInputChange?.(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isRefetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
