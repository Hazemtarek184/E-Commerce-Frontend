import { z } from "zod";
import type { TFunction } from "i18next";

const phoneNumberRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

export const getPhoneContactSchema = (t?: TFunction) => z.object({
  phoneNumber: z
    .string()
    .min(1, t ? t('forms.validation.required') : "Phone number is required")
    .regex(
      phoneNumberRegex,
      t ? t('forms.validation.invalid_phone') : "Please enter a valid phone number"
    ),
  hasWhatsApp: z.boolean(),
  canCall: z.boolean().optional().default(true),
});

export const getOfferSchema = (t?: TFunction) => z.object({
  name: z.string().min(1, t ? t('forms.validation.required') : "Offer name is required"),
  description: z.string().min(1, t ? t('forms.validation.required') : "Offer description is required"),
  imageUrl: z.array(z.string()).default([]),
});

export const imageUrlSchema = z.object({
  url: z.string(),
  public_id: z.string(),
});

export const getCreateServiceProviderSchema = (t?: TFunction) => z.object({
  image: z.array(z.any()).optional(),
  name: z.string().min(1, t ? t('forms.validation.required') : "Name is required"),
  bio: z.string().min(1, t ? t('forms.validation.required') : "Bio is required"),
  workingDays: z
    .array(z.string())
    .min(1, t ? t('forms.validation.required') : "At least one working day is required"),
  workingHour: z.string().min(1, t ? t('forms.validation.required') : "Working hour is required"),
  closingHour: z.string().min(1, t ? t('forms.validation.required') : "Closing hour is required"),
  phoneContacts: z
    .array(getPhoneContactSchema(t))
    .min(1, t ? t('forms.validation.required') : "At least one phone contact is required"),
  locationLinks: z
    .array(z.string())
    .min(1, t ? t('forms.validation.required') : "At least one location link is required"),
  offers: z.array(getOfferSchema(t)).optional().default([]),
});

export const getUpdateServiceProviderSchema = (t?: TFunction) => z.object({
  image: z.array(z.any()).optional(),
  name: z.string().min(1, t ? t('forms.validation.required') : "Name is required").optional(),
  bio: z.string().min(1, t ? t('forms.validation.required') : "Bio is required").optional(),
  workingDays: z.array(z.string()).optional(),
  workingHour: z.string().optional(),
  closingHour: z.string().optional(),
  phoneContacts: z.array(getPhoneContactSchema(t)).optional(),
  locationLinks: z.array(z.string()).optional(),
  offers: z.array(getOfferSchema(t)).optional(),
  deletedImageIds: z.array(z.string()).optional(),
});

// Static types using the no-arg version (default messages)
export type CreateServiceProviderInput = z.infer<
  ReturnType<typeof getCreateServiceProviderSchema>
>;
export type UpdateServiceProviderInput = z.infer<
  ReturnType<typeof getUpdateServiceProviderSchema>
>;
export type PhoneContactInput = z.infer<ReturnType<typeof getPhoneContactSchema>>;
export type OfferInput = z.infer<ReturnType<typeof getOfferSchema>>;

// Legacy exports for backward compatibility if needed (but we should switch)
export const createServiceProviderSchema = getCreateServiceProviderSchema();
export const updateServiceProviderSchema = getUpdateServiceProviderSchema();
export const phoneContactSchema = getPhoneContactSchema();
export const offerSchema = getOfferSchema();
