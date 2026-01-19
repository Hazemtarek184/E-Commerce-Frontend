/**
 * Category API functions
 * Uses the centralized apiClient
 */
import { apiClient } from './client';
import type { IMainCategory, IApiResponse } from '../interfaces';

export const getCategories = async () => {
  const response = await apiClient.get<IApiResponse<{ categories: IMainCategory[] }>>('/categories');
  return response.data;
};

export const createCategory = async (data: { englishName: string; arabicName: string }) => {
  const response = await apiClient.post<IApiResponse<IMainCategory>>('/categories', data);
  return response.data;
};

export const updateCategory = async (categoryId: string, data: { englishName: string; arabicName: string }) => {
  const response = await apiClient.put<IApiResponse<IMainCategory>>(`/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await apiClient.delete<IApiResponse<null>>(`/categories/${categoryId}`);
  return response.data;
};
