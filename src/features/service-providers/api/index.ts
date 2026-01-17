import axios from "axios";
import type { IApiResponse, IServiceProvider } from "../../../interfaces";
import type {
  CreateServiceProviderInput,
  UpdateServiceProviderInput,
} from "../schemas";

const api = axios.create({
  baseURL: "https://e-commerce-three-sigma-49.vercel.app/api",
  // baseURL: "http://localhost:8000/api", // development
});

export const getServiceProvidersBySubCategory = async (
  subCategoryId: string
) => {
  const response = await api.get<
    IApiResponse<{ serviceProviders: IServiceProvider[] }>
  >(`/service-providers/${subCategoryId}`);
  return response.data;
};

export const createServiceProvider = async (
  subCategoryId: string,
  data: CreateServiceProviderInput
) => {
  const formData = new FormData();

  if (data.image && data.image.length > 0) {
    data.image.forEach((file) => {
      formData.append("image", file);
    });
  }
  formData.append("name", data.name);
  formData.append("bio", data.bio);
  data.workingDays.forEach((day) => formData.append("workingDays", day));
  formData.append("workingHour", data.workingHour);
  formData.append("closingHour", data.closingHour);
  data.phoneContacts.forEach((contact, index) => {
    formData.append(
      `phoneContacts[${index}][phoneNumber]`,
      contact.phoneNumber
    );
    formData.append(
      `phoneContacts[${index}][hasWhatsApp]`,
      String(contact.hasWhatsApp)
    );
    formData.append(
      `phoneContacts[${index}][canCall]`,
      String(contact.canCall)
    );
  });
  data.locationLinks.forEach((link) => formData.append("locationLinks", link));
  if (data.offers && data.offers.length > 0) {
    data.offers.forEach((offer, index) => {
      formData.append(`offers[${index}][name]`, offer.name);
      formData.append(`offers[${index}][description]`, offer.description);
      offer.imageUrl.forEach((url) =>
        formData.append(`offers[${index}][imageUrl]`, url)
      );
    });
  }

  const response = await api.post<IApiResponse<IServiceProvider>>(
    `/service-providers/${subCategoryId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateServiceProvider = async (
  serviceProviderId: string,
  data: UpdateServiceProviderInput
) => {
  const formData = new FormData();

  // 1. Append files as usual
  if (data.image && data.image.length > 0) {
    data.image.forEach((file) => {
      formData.append("image", file);
    });
  }

  // 2. Append the REST of the data as a single JSON string
  const { image, ...rest } = data;
  formData.append("data", JSON.stringify(rest));

  const response = await api.put<
    IApiResponse<{ serviceProvider: IServiceProvider }>
  >(`/service-providers/${serviceProviderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteServiceProvider = async (serviceProviderId: string) => {
  const response = await api.delete<IApiResponse<null>>(
    `/service-providers/${serviceProviderId}`
  );
  return response.data;
};
