import React from 'react';
import { Box, Typography, Button, Paper, Stack, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

interface OffersSectionProps {
  form: UseFormReturn<any>;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'offers',
  });

  const errors = form.formState.errors.offers;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2">Offers (Optional)</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append({ name: '', description: '', imageUrl: [] })}
        >
          Add Offer
        </Button>
      </Box>
      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Controller
              name={`offers.${index}.name`}
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Offer Name"
                  fullWidth
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
                  label="Offer Description"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!(errors as any)?.[index]?.description}
                  helperText={(errors as any)?.[index]?.description?.message}
                />
              )}
            />
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => remove(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};
