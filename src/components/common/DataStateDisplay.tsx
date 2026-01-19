import React, { type ReactNode } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DataStateDisplayProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  onClearSearch?: () => void;
  children?: ReactNode;
}

export const DataStateDisplay: React.FC<DataStateDisplayProps> = ({
  loading,
  empty,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  onClearSearch,
  children,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={12}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  if (empty) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 8,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        {emptyIcon && (
          <Box
            sx={{
              mb: 2,
              color: 'text.disabled',
              '& svg': { fontSize: 64 },
            }}
          >
            {emptyIcon}
          </Box>
        )}
        <Typography variant="h6" color="text.primary" gutterBottom fontWeight={500}>
          {emptyTitle || t('common.no_results')}
        </Typography>
        {emptyMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            {emptyMessage}
          </Typography>
        )}
        {onClearSearch && (
          <Button variant="outlined" onClick={onClearSearch} size="small">
            {t('common.clear_search')}
          </Button>
        )}
      </Paper>
    );
  }

  return <>{children}</>;
};
