import React from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

interface LocationLinksSectionProps {
  form: UseFormReturn<any>;
}

export const LocationLinksSection: React.FC<LocationLinksSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locationLinks',
  });

  const errors = form.formState.errors.locationLinks;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2">Location Links *</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append('')}
        >
          Add Location
        </Button>
      </Box>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" gap={1} mb={1}>
          <Controller
            name={`locationLinks.${index}`}
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`Location ${index + 1}`}
                fullWidth
                required
                error={!!(errors as any)?.[index]}
              />
            )}
          />
          {fields.length > 1 && (
            <IconButton onClick={() => remove(index)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      {errors && !Array.isArray(errors) && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {(errors as any)?.message}
        </Typography>
      )}
    </Box>
  );
};
