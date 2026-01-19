/**
 * Shared MUI sx prop styles
 * Eliminates repeated style objects across components
 */
import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material';

/**
 * Interactive card with hover lift effect
 * Used for category cards, subcategory cards, provider cards
 */
export const cardHoverStyles: SxProps<Theme> = {
  height: '100%',
  borderRadius: 3,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
};

/**
 * Floating action buttons container (edit/delete buttons on cards)
 * Add className="card-actions" to target element for hover reveal
 */
export const floatingActionsStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  display: 'flex',
  gap: 1,
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease',
};

/**
 * Action button base style (for edit/delete icon buttons)
 */
export const actionButtonStyles: SxProps<Theme> = {
  backgroundColor: 'white',
  boxShadow: 2,
};

/**
 * Edit button hover variant
 */
export const editButtonStyles: SxProps<Theme> = {
  ...actionButtonStyles,
  '&:hover': {
    backgroundColor: 'primary.light',
    color: 'white',
  },
};

/**
 * Delete button hover variant
 */
export const deleteButtonStyles: SxProps<Theme> = {
  ...actionButtonStyles,
  '&:hover': {
    backgroundColor: 'error.light',
    color: 'white',
  },
};

/**
 * Responsive grid layout for cards
 * 1 column on xs, 2 on sm, 3 on lg, 4 on xl
 */
export const responsiveGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
  gap: 3,
};

/**
 * Small chip style (for working days, languages, etc.)
 */
export const smallChipStyles: SxProps<Theme> = {
  fontSize: '0.7rem',
  height: 20,
};

/**
 * WhatsApp contact chip style
 */
export const whatsappChipStyles: SxProps<Theme> = {
  fontSize: '0.7rem',
  backgroundColor: alpha('#25d366', 0.1),
  color: '#25d366',
  '& .MuiChip-icon': {
    color: 'inherit',
  },
};

/**
 * Phone contact chip style
 */
export const phoneChipStyles: SxProps<Theme> = {
  fontSize: '0.7rem',
  backgroundColor: alpha('#2196f3', 0.1),
  color: '#2196f3',
  '& .MuiChip-icon': {
    color: 'inherit',
  },
};

/**
 * Avatar base style (56x56, primary color)
 */
export const cardAvatarStyles: SxProps<Theme> = {
  width: 56,
  height: 56,
  backgroundColor: 'primary.main',
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

/**
 * Text truncation for multi-line bio/description
 */
export const multiLineTruncateStyles = (lines: number = 3): SxProps<Theme> => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.6,
});

/**
 * Card content with full height flex layout
 */
export const cardContentStyles: SxProps<Theme> = {
  p: 3,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};
