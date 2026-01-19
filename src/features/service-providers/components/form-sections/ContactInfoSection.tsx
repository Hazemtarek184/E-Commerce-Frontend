import React from 'react';
import { Box, Typography, Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSection } from './FormSection';

interface ContactInfoSectionProps {
  form: UseFormReturn<any>;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phoneContacts',
  });

  const errors = form.formState.errors.phoneContacts;

  return (
    <FormSection
      title={t('forms.contact_info.title')}
      required
      icon={<PhoneIcon fontSize="small" />}
      action={
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append({ phoneNumber: '', hasWhatsApp: false, canCall: true })}
        >
          {t('common.add')}
        </Button>
      }
    >
      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Controller
                name={`phoneContacts.${index}.phoneNumber`}
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('forms.contact_info.phone')}
                    type="tel"
                    fullWidth
                    size="small"
                    placeholder="+1234567890"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9+\-()\s.]/g, '');
                      field.onChange(value);
                    }}
                    error={!!(errors as any)?.[index]?.phoneNumber}
                    helperText={(errors as any)?.[index]?.phoneNumber?.message}
                  />
                )}
              />
              <Box display="flex" gap={2} alignItems="center">
                <Controller
                  name={`phoneContacts.${index}.hasWhatsApp`}
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>{t('forms.contact_info.whatsapp')}</InputLabel>
                      <Select
                        {...field}
                        value={field.value ? 'yes' : 'no'}
                        onChange={(e) => field.onChange(e.target.value === 'yes')}
                        label={t('forms.contact_info.whatsapp')}
                      >
                        <MenuItem value="yes">{t('common.yes')}</MenuItem>
                        <MenuItem value="no">{t('common.no')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name={`phoneContacts.${index}.canCall`}
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>{t('forms.contact_info.can_call')}</InputLabel>
                      <Select
                        {...field}
                        value={field.value ? 'yes' : 'no'}
                        onChange={(e) => field.onChange(e.target.value === 'yes')}
                        label={t('forms.contact_info.can_call')}
                      >
                        <MenuItem value="yes">{t('common.yes')}</MenuItem>
                        <MenuItem value="no">{t('common.no')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                {fields.length > 1 && (
                  <IconButton
                    onClick={() => remove(index)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
      {errors && !Array.isArray(errors) && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {(errors as any)?.message}
        </Typography>
      )}
    </FormSection>
  );
};
