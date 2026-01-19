/**
 * API Layer - Public exports
 * Import from '@/api' or '../api' to access all API functions
 */

// Re-export the client for advanced use cases
export { apiClient } from './client';

// Category APIs
export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories';

// Sub-Category APIs
export {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from './sub-categories';
