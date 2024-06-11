'use client';

// React Hook Form
import { Controller, useForm } from 'react-hook-form';

// Zod
import { zodResolver } from '@hookform/resolvers/zod';
import { sampleFormSchema, SampleFormSchema } from './schemas/sampleSchema';

// Tanstack Query
import { useCreateSample } from '@/features/user/samples/sampleMutations';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const defaultValues: SampleFormSchema = {
  name: '',
  code: '',
};

export default function SampleForm() {
  const { control, handleSubmit, reset } = useForm<SampleFormSchema>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues,
  });

  const createSampleMutation = useCreateSample();

  const onSubmit = (data: SampleFormSchema) => {
    createSampleMutation.mutate(data);
    reset(defaultValues);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '300px',
      }}
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <TextField
              {...field}
              required
              error={Boolean(error)}
              helperText={error?.message}
              label="Name"
              placeholder="Input Name"
              size="small"
            />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="code"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <TextField
              {...field}
              required
              error={Boolean(error)}
              helperText={error?.message}
              label="Code"
              placeholder="Input Code"
              size="small"
            />
          </FormControl>
        )}
      />

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
}
