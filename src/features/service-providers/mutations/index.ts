import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
} from "../api";
import type {
  CreateServiceProviderInput,
  UpdateServiceProviderInput,
} from "../schemas";

export const useCreateServiceProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subCategoryId, data }: { subCategoryId: string; data: CreateServiceProviderInput }) =>
      createServiceProvider(subCategoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-providers", variables.subCategoryId],
      });
    },
  });
};

export const useUpdateServiceProvider = (subCategoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceProviderId,
      data,
    }: {
      serviceProviderId: string;
      data: UpdateServiceProviderInput;
    }) => updateServiceProvider(serviceProviderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-providers", subCategoryId],
      });
    },
  });
};

export const useDeleteServiceProvider = (subCategoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceProviderId: string) =>
      deleteServiceProvider(serviceProviderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-providers", subCategoryId],
      });
    },
  });
};
