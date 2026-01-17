import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import type { UseFormReturn } from 'react-hook-form';

const DAYS_OF_WEEK = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
];

interface WorkingDaysSectionProps {
  form: UseFormReturn<any>;
}

export const WorkingDaysSection: React.FC<WorkingDaysSectionProps> = ({ form }) => {
  const workingDays = form.watch('workingDays') as string[] || [];
  const error = form.formState.errors.workingDays?.message as string | undefined;

  const toggleDay = (day: string) => {
    const currentDays = workingDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    form.setValue('workingDays', newDays, { shouldValidate: true });
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Working Days *
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {DAYS_OF_WEEK.map((day) => (
          <Chip
            key={day}
            label={day}
            onClick={() => toggleDay(day)}
            color={workingDays.includes(day) ? 'primary' : 'default'}
            variant={workingDays.includes(day) ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
