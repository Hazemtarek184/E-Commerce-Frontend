import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } from '../api';

export const useSubCategories = (mainCategoryId?: string) => {
  return useQuery({
    queryKey: ['subCategories', mainCategoryId],
    queryFn: async () => {
      if (!mainCategoryId) return [];
      const res = await getSubCategories(mainCategoryId);
      // Handle the nested structure from API response
      return res.data?.data?.subCategories || [];
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
      queryClient.invalidateQueries({ queryKey: ['subCategories'] }); // Invalidate all subcategories
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { englishName: string; arabicName: string } }) =>
      updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
  });

  return { create, update, remove };
};
