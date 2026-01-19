import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api';
import { QUERY_KEYS } from '../config/constants';
import type { IMainCategory } from '../interfaces';

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: async (): Promise<IMainCategory[]> => {
      const result = await getCategories();
      // result is IApiResponse<{ categories: IMainCategory[] }>
      // result.data is { categories: IMainCategory[] } | undefined
      if (result.success && result.data) {
        return result.data.categories;
      }
      return [];
    },
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { englishName: string; arabicName: string } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });

  return { create, update, remove };
};
