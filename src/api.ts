import axios from 'axios';
import type { IMainCategory, ISubCategory, IServiceProvider, IApiResponse } from './interfaces';

const api = axios.create({
    baseURL: 'https://e-commerce-three-sigma-49.vercel.app/api',
});

// Categories
export const getCategories = () => api.get<IApiResponse<{ categories: IMainCategory[] }>>('/categories');
export const createCategory = (data: { englishName: string; arabicName: string }) => api.post<IApiResponse<IMainCategory>>('/categories', data);
export const updateCategory = (categoryId: string, data: { englishName: string; arabicName: string }) => api.put<IApiResponse<IMainCategory>>(`/categories/${categoryId}`, data);
export const deleteCategory = (categoryId: string) => api.delete<IApiResponse<null>>(`/categories/${categoryId}`);

// Sub-categories
export const getSubCategories = (mainCategoryId: string) => api.get<IApiResponse<{ subCategories: ISubCategory[] }>>(`/sub-categories/${mainCategoryId}`);
export const createSubCategory = (mainCategoryId: string, data: { englishName: string; arabicName: string }) => api.post<IApiResponse<ISubCategory>>(`/sub-categories/${mainCategoryId}`, data);
export const updateSubCategory = (subCategoryId: string, data: { englishName: string; arabicName: string }) => api.put<IApiResponse<ISubCategory>>(`/sub-categories/${subCategoryId}`, data);
export const deleteSubCategory = (subCategoryId: string) => api.delete<IApiResponse<null>>(`/sub-categories/${subCategoryId}`);

// Service Providers
export const getServiceProviders = (subCategoryId: string) => api.get<IApiResponse<{ serviceProviders: IServiceProvider[] }>>(`/service-providers/${subCategoryId}`);
export const createServiceProvider = (subCategoryId: string, data: IServiceProvider) => api.post<IApiResponse<IServiceProvider>>(`/service-providers/${subCategoryId}`, data);
export const updateServiceProvider = (serviceProviderId: string, data: IServiceProvider) => api.put<IApiResponse<{ serviceProvider: IServiceProvider }>>(`/service-providers/${serviceProviderId}`, data);
export const deleteServiceProvider = (serviceProviderId: string) => api.delete<IApiResponse<null>>(`/service-providers/${serviceProviderId}`); 