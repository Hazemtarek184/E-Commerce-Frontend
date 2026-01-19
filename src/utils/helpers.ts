/**
 * Shared utility functions
 * Centralized helpers used across multiple components
 */
import { COLORS } from '../config/constants';

/**
 * Extract initials from a name string
 * @example getInitials("John Doe") => "JD"
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get color based on rating value
 * - >= 4.5: Excellent (green)
 * - >= 4.0: Good (orange)
 * - < 4.0: Poor (red)
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return COLORS.RATING_EXCELLENT;
  if (rating >= 4.0) return COLORS.RATING_GOOD;
  return COLORS.RATING_POOR;
};

/**
 * Format phone number for display
 * @example formatPhoneNumber("1234567890") => "+1 234 567 890"
 */
export const formatPhoneNumber = (phone: string): string => {
  // Simple formatting - can be extended based on requirements
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Safely extract error message from various error shapes
 */
export const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  
  // Axios error shape
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};
