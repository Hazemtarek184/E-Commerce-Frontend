import { useQuery } from "@tanstack/react-query";
import { getServiceProvidersBySubCategory } from "../api";

export const useServiceProviders = (subCategoryId: string) => {
  return useQuery({
    queryKey: ["service-providers", subCategoryId],
    queryFn: () => getServiceProvidersBySubCategory(subCategoryId),
    enabled: !!subCategoryId,
  });
};
