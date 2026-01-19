import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../api';
import { QUERY_KEYS } from '../config/constants';
import type { ISubCategory } from '../interfaces';

export const useSubCategories = (mainCategoryId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUB_CATEGORIES(mainCategoryId || ''),
    queryFn: async (): Promise<ISubCategory[]> => {
      if (!mainCategoryId) return [];
      const result = await getSubCategories(mainCategoryId);
      // result is IApiResponse<{ subCategories: ISubCategory[] }>
      if (result.success && result.data) {
        return result.data.subCategories;
      }
      return [];
    },
    enabled: !!mainCategoryId,
  });
};

export const useSubCategoryMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: { englishName: string; arabicName: string } }) =>
      createSubCategory(categoryId, data),
    onSuccess: () => {
      // Invalidate all sub-categories queries
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { englishName: string; arabicName: string } }) =>
      updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-categories'] });
    },
  });

  return { create, update, remove };
};
