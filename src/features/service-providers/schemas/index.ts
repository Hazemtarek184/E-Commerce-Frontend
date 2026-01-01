import { z } from "zod";

const phoneNumberRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export const phoneContactSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      phoneNumberRegex,
      "Please enter a valid phone number (e.g., +1234567890, 123-456-7890, or 1234567890)"
    ),
  hasWhatsApp: z.boolean(),
  canCall: z.boolean().optional().default(true),
});

export const offerSchema = z.object({
  name: z.string().min(1, "Offer name is required"),
  description: z.string().min(1, "Offer description is required"),
  imageUrl: z.array(z.string()).default([]),
});

export const imageUrlSchema = z.object({
  url: z.string(),
  public_id: z.string(),
});

export const createServiceProviderSchema = z.object({
  image: z.array(z.instanceof(File)).optional(),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  workingDays: z
    .array(z.string())
    .min(1, "At least one working day is required"),
  workingHours: z
    .array(z.string())
    .min(1, "At least one working hour is required"),
  closingHours: z
    .array(z.string())
    .min(1, "At least one closing hour is required"),
  phoneContacts: z
    .array(phoneContactSchema)
    .min(1, "At least one phone contact is required"),
  locationLinks: z
    .array(z.string())
    .min(1, "At least one location link is required"),
  offers: z.array(offerSchema).optional().default([]),
});

export const updateServiceProviderSchema = z.object({
  image: z.array(z.instanceof(File)).optional(),
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().min(1, "Bio is required").optional(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.array(z.string()).optional(),
  closingHours: z.array(z.string()).optional(),
  phoneContacts: z.array(phoneContactSchema).optional(),
  locationLinks: z.array(z.string()).optional(),
  offers: z.array(offerSchema).optional(),
  deletedImageIds: z.array(z.string()).optional(),
});

export type CreateServiceProviderInput = z.infer<
  typeof createServiceProviderSchema
>;
export type UpdateServiceProviderInput = z.infer<
  typeof updateServiceProviderSchema
>;
export type PhoneContactInput = z.infer<typeof phoneContactSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
