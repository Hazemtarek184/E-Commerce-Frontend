import React from 'react';
import { Box, Typography, Button, Paper, Stack, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFieldArray, Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

interface ContactInfoSectionProps {
  form: UseFormReturn<any>;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phoneContacts',
  });

  const errors = form.formState.errors.phoneContacts;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2">Phone Contacts *</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append({ phoneNumber: '', hasWhatsApp: false, canCall: true })}
        >
          Add Contact
        </Button>
      </Box>
      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          <Stack spacing={2}>
            <Controller
              name={`phoneContacts.${index}.phoneNumber`}
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  required
                  placeholder="+1234567890 or 123-456-7890"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9+\-()\s.]/g, '');
                    field.onChange(value);
                  }}
                  error={!!(errors as any)?.[index]?.phoneNumber}
                  helperText={(errors as any)?.[index]?.phoneNumber?.message}
                />
              )}
            />
            <Box display="flex" gap={2}>
              <Controller
                name={`phoneContacts.${index}.hasWhatsApp`}
                control={form.control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Has WhatsApp</InputLabel>
                    <Select
                      {...field}
                      value={field.value ? 'yes' : 'no'}
                      onChange={(e) => field.onChange(e.target.value === 'yes')}
                      label="Has WhatsApp"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name={`phoneContacts.${index}.canCall`}
                control={form.control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Can Call</InputLabel>
                    <Select
                      {...field}
                      value={field.value ? 'yes' : 'no'}
                      onChange={(e) => field.onChange(e.target.value === 'yes')}
                      label="Can Call"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {fields.length > 1 && (
                <IconButton onClick={() => remove(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
      {errors && !Array.isArray(errors) && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {(errors as any)?.message}
        </Typography>
      )}
    </Box>
  );
};
