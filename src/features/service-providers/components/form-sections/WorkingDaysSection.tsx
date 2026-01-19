import React from 'react';
import { Stack, Chip, Typography } from '@mui/material';
import type { UseFormReturn } from 'react-hook-form';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTranslation } from 'react-i18next';
import { FormSection } from './FormSection';

const DAYS_OF_WEEK = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
];

interface WorkingDaysSectionProps {
  form: UseFormReturn<any>;
}

export const WorkingDaysSection: React.FC<WorkingDaysSectionProps> = ({ form }) => {
  const { t } = useTranslation();
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
    <FormSection title={t('forms.working_days.title')} required icon={<CalendarMonthIcon fontSize="small" />}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {DAYS_OF_WEEK.map((day) => (
          <Chip
            key={day}
            label={t(`forms.working_days.${day.toLowerCase()}`)}
            onClick={() => toggleDay(day)}
            color={workingDays.includes(day) ? 'primary' : 'default'}
            variant={workingDays.includes(day) ? 'filled' : 'outlined'}
            size="medium"
            sx={{
              minWidth: 52,
              fontWeight: 500,
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </Stack>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </FormSection>
  );
};
