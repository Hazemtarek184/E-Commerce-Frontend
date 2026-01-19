/**
 * Sub-Category API functions
 * Uses the centralized apiClient
 */
import { apiClient } from './client';
import type { ISubCategory, IApiResponse } from '../interfaces';

export const getSubCategories = async (mainCategoryId: string) => {
  const response = await apiClient.get<IApiResponse<{ subCategories: ISubCategory[] }>>(
    `/sub-categories/${mainCategoryId}`
  );
  return response.data;
};

export const createSubCategory = async (
  mainCategoryId: string,
  data: { englishName: string; arabicName: string }
) => {
  const response = await apiClient.post<IApiResponse<ISubCategory>>(
    `/sub-categories/${mainCategoryId}`,
    data
  );
  return response.data;
};

export const updateSubCategory = async (
  subCategoryId: string,
  data: { englishName: string; arabicName: string }
) => {
  const response = await apiClient.put<IApiResponse<ISubCategory>>(
    `/sub-categories/${subCategoryId}`,
    data
  );
  return response.data;
};

export const deleteSubCategory = async (subCategoryId: string) => {
  const response = await apiClient.delete<IApiResponse<null>>(`/sub-categories/${subCategoryId}`);
  return response.data;
};
