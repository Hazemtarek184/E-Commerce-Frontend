import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actionButtonText?: string;
  onAction?: () => void;
  extraAction?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actionButtonText,
  onAction,
  extraAction
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            {extraAction}
            {actionButtonText && onAction && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={onAction}
                sx={{
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {actionButtonText}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
