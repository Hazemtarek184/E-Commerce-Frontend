/**
 * Application-wide configuration constants
 * Centralized location for environment URLs, colors, and magic values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://e-commerce-three-sigma-49.vercel.app/api',
  // Uncomment for local development:
  // BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Theme Colors - Semantic naming for consistency
export const COLORS = {
  // Status colors
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',

  // Brand colors
  WHATSAPP: '#25d366',

  // Rating thresholds
  RATING_EXCELLENT: '#4caf50', // >= 4.5
  RATING_GOOD: '#ff9800',      // >= 4.0
  RATING_POOR: '#f44336',      // < 4.0
} as const;

// Working days list
export const WORKING_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

// Query Keys - Centralized for React Query cache management
export const QUERY_KEYS = {
  CATEGORIES: ['categories'] as const,
  SUB_CATEGORIES: (mainCategoryId: string) => ['sub-categories', mainCategoryId] as const,
  SERVICE_PROVIDERS: (subCategoryId: string) => ['service-providers', subCategoryId] as const,
} as const;
