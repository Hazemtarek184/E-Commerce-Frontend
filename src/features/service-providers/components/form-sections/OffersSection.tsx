import React from 'react';
import { Box, Typography, Button, Stack, TextField, IconButton, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSection } from './FormSection';

interface OffersSectionProps {
  form: UseFormReturn<any>;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'offers',
  });

  const errors = form.formState.errors.offers;

  return (
    <FormSection
      title={t('forms.offers.title')}
      icon={<LocalOfferIcon fontSize="small" />}
      action={
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append({ name: '', description: '', imageUrl: [] })}
        >
          {t('forms.offers.add_offer')}
        </Button>
      }
    >
      {fields.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          {t('common.no_results')}
        </Typography>
      ) : (
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
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t('forms.offers.title')} #{index + 1}
                  </Typography>
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
                </Box>
                <Controller
                  name={`offers.${index}.name`}
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('forms.offers.offer_title_en')}
                      fullWidth
                      size="small"
                      placeholder="e.g., 20% Off Summer Sale"
                      error={!!(errors as any)?.[index]?.name}
                      helperText={(errors as any)?.[index]?.name?.message}
                    />
                  )}
                />
                <Controller
                  name={`offers.${index}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('forms.offers.description_en')}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Describe the offer details..."
                      error={!!(errors as any)?.[index]?.description}
                      helperText={(errors as any)?.[index]?.description?.message}
                    />
                  )}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </FormSection>
  );
};
