import React from 'react';
import { TextField, Stack } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import { FormSection } from './FormSection';

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  const { control, formState: { errors } } = form;

  return (
    <FormSection title={t('forms.basic_info.title')} required icon={<InfoOutlinedIcon fontSize="small" />}>
      <Stack spacing={2.5}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('forms.basic_info.english_name')} // Using generic name key mapping
              fullWidth
              size="small"
              placeholder={t('forms.basic_info.english_name')}
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
              label={t('forms.basic_info.english_description')} // Using generic desc mapping
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder={t('forms.basic_info.english_description')}
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
                  label={t('forms.working_days.start_time')}
                  value={field.value ? dayjs(field.value, 'HH:mm') : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.format('HH:mm') : '');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
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
                  label={t('forms.working_days.end_time')}
                  value={field.value ? dayjs(field.value, 'HH:mm') : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.format('HH:mm') : '');
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
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
    </FormSection>
  );
};
