import React from 'react';
import { Box, Typography, alpha } from '@mui/material';

interface FormSectionProps {
  title: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  required = false,
  icon,
  children,
  action,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {icon && (
            <Box
              sx={{
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
            {required && (
              <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                *
              </Typography>
            )}
          </Typography>
        </Box>
        {action}
      </Box>
      {children}
    </Box>
  );
};
