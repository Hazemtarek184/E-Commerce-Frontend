import React, { type ReactNode } from 'react';
import { Box, Paper, Typography, Button, alpha, CircularProgress } from '@mui/material';

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
  emptyTitle = 'No items found',
  emptyMessage,
  onClearSearch,
  children
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress size={60} />
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
          backgroundColor: alpha('#f5f5f5', 0.5),
        }}
      >
        {emptyIcon && (
          <Box sx={{ mb: 2, color: 'text.disabled', '& svg': { fontSize: 80 } }}>
            {emptyIcon}
          </Box>
        )}
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyTitle}
        </Typography>
        {emptyMessage && (
          <Typography variant="body2" color="text.secondary" mb={3}>
            {emptyMessage}
          </Typography>
        )}
        {onClearSearch && (
          <Button variant="outlined" onClick={onClearSearch} sx={{ borderRadius: 2 }}>
            Clear Search
          </Button>
        )}
      </Paper>
    );
  }

  return <>{children}</>;
};
