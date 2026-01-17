import React from 'react';
import { TextField, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const { control, formState: { errors } } = form;

  return (
    <Stack spacing={3}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Bio"
            fullWidth
            required
            multiline
            rows={4}
            error={!!errors.bio}
            helperText={errors.bio?.message as string}
          />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2}>
          <Controller
            name="workingHour"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Opening Hour"
                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.format('HH:mm') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.workingHour,
                    helperText: errors.workingHour?.message as string
                  }
                }}
              />
            )}
          />
          <Controller
            name="closingHour"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Closing Hour"
                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.format('HH:mm') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.closingHour,
                    helperText: errors.closingHour?.message as string
                  }
                }}
              />
            )}
          />
        </Stack>
      </LocalizationProvider>
    </Stack>
  );
};
