import React from 'react';
import { Box, Typography, Button, TextField, IconButton, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSection } from './FormSection';

interface LocationLinksSectionProps {
  form: UseFormReturn<any>;
}

export const LocationLinksSection: React.FC<LocationLinksSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locationLinks',
  });

  const errors = form.formState.errors.locationLinks;

  return (
    <FormSection
      title={t('forms.location.title')}
      required
      icon={<LocationOnIcon fontSize="small" />}
      action={
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append('')}
        >
          {t('common.add')}
        </Button>
      }
    >
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" gap={1} mb={1.5}>
          <Controller
            name={`locationLinks.${index}`}
            control={form.control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                value={controllerField.value ?? ''}
                label={`${t('forms.location.address')} ${index + 1}`}
                placeholder="https://maps.google.com/..."
                fullWidth
                size="small"
                error={!!(errors as any)?.[index]}
              />
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
      ))}
      {errors && !Array.isArray(errors) && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {(errors as any)?.message}
        </Typography>
      )}
    </FormSection>
  );
};
