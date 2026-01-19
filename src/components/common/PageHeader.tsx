import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actionButtonText?: string;
  onAction?: () => void;
  extraAction?: ReactNode;
  backButton?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actionButtonText,
  onAction,
  extraAction,
  backButton,
}) => {
  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 3, md: 4 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {backButton}
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '& svg': { fontSize: 24 },
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography variant="h5" fontWeight="700" color="text.primary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          {extraAction}
          {actionButtonText && onAction && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAction}
              sx={{
                px: 3,
                py: 1,
              }}
            >
              {actionButtonText}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
