import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceProviderSchema, updateServiceProviderSchema } from '../schemas';
import type { CreateServiceProviderInput, UpdateServiceProviderInput } from '../schemas';
import type { IServiceProvider } from '../../../interfaces';

import { ImageUploadSection } from './form-sections/ImageUploadSection';
import { BasicInfoSection } from './form-sections/BasicInfoSection';
import { WorkingDaysSection } from './form-sections/WorkingDaysSection';
import { ContactInfoSection } from './form-sections/ContactInfoSection';
import { LocationLinksSection } from './form-sections/LocationLinksSection';
import { OffersSection } from './form-sections/OffersSection';

interface ServiceProviderFormBaseProps {
  isLoading?: boolean;
  defaultValues?: Partial<IServiceProvider>;
  onCancel?: () => void;
}

interface CreateServiceProviderFormProps extends ServiceProviderFormBaseProps {
  isEdit?: false;
  onSubmit: (data: CreateServiceProviderInput) => void;
}

interface UpdateServiceProviderFormProps extends ServiceProviderFormBaseProps {
  isEdit: true;
  onSubmit: (data: UpdateServiceProviderInput) => void;
}

type ServiceProviderFormProps = CreateServiceProviderFormProps | UpdateServiceProviderFormProps;

export const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
  isLoading = false,
  onCancel,
}) => {
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const normalizePhoneContacts = (
    contacts?: Array<{
      phoneNumber: string;
      hasWhatsApp: boolean | string;
      canCall?: boolean | string;
    }>
  ) => {
    if (!contacts || contacts.length === 0) {
      return [{ phoneNumber: '', hasWhatsApp: false, canCall: true }];
    }
    return contacts.map((contact) => ({
      phoneNumber: contact.phoneNumber || '',
      hasWhatsApp:
        typeof contact.hasWhatsApp === 'boolean'
          ? contact.hasWhatsApp
          : contact.hasWhatsApp === 'true' || contact.hasWhatsApp === 'yes',
      canCall:
        typeof contact.canCall === 'boolean'
          ? contact.canCall
          : contact.canCall === undefined || contact.canCall === null
            ? true
            : contact.canCall === 'true' || contact.canCall === 'yes',
    }));
  };

  const defaultFormValues = {
    name: defaultValues?.name || '',
    bio: defaultValues?.bio || '',
    workingDays: defaultValues?.workingDays || [],
    workingHour: defaultValues?.workingHour || '',
    closingHour: defaultValues?.closingHour || '',
    phoneContacts: normalizePhoneContacts(defaultValues?.phoneContacts),
    locationLinks: defaultValues?.locationLinks || [],
    offers: defaultValues?.offers || [],
  };

  // We cast the hook to 'any' here because TS struggles with the union type of Create/Update input
  // but we know it's valid based on the schema and isEdit prop.
  const form = useForm<any>({
    resolver: zodResolver(isEdit ? updateServiceProviderSchema : createServiceProviderSchema),
    defaultValues: { ...defaultFormValues, image: undefined },
  });

  const handleDeleteExistingImage = (publicId: string) => {
    setDeletedImageIds((prev) => [...prev, publicId]);
  };

  const handleFormSubmit = (data: any) => {
    // Force image field to be included if it wasn't picked up by default, though react-hook-form handles this.
    // Ensure data.image is correct.
    
    if (isEdit) {
      onSubmit({ ...data, deletedImageIds });
    } else {
      onSubmit(data);
    }
  };

  const handleValidationErrors = (errors: any) => {
      console.error("Validation Errors:", errors);
      // Optional: Display a general error message to the user via toast/alert if needed
  };

  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit(handleFormSubmit, handleValidationErrors)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <ImageUploadSection
        form={form}
        defaultImages={defaultValues?.imagesUrl}
        isEdit={!!isEdit}
        onDeleteExisting={handleDeleteExistingImage}
      />

      <BasicInfoSection form={form} />
      <WorkingDaysSection form={form} />
      <ContactInfoSection form={form} />
      <LocationLinksSection form={form} />
      <OffersSection form={form} />

      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};
