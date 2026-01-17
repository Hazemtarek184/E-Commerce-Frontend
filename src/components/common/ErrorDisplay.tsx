import React from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ErrorDisplayProps {
  error: string | null;
  onClear?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        backgroundColor: '#ffebee',
        border: '1px solid #f44336',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="error" variant="body2">
          {error}
        </Typography>
        {onClear && (
          <IconButton size="small" onClick={onClear} sx={{ color: '#f44336' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};
