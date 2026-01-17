// @ts-nocheck
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Stack,
  Paper,
  Avatar,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createServiceProviderSchema,
  updateServiceProviderSchema,
} from "../schemas";
import type {
  CreateServiceProviderInput,
  UpdateServiceProviderInput,
} from "../schemas";
import type { IServiceProvider } from "../../../interfaces";
import { useState, useRef, useEffect } from "react";

interface ServiceProviderFormBaseProps {
  isLoading?: boolean;
  defaultValues?: Partial<IServiceProvider>;
}

interface CreateServiceProviderFormProps extends ServiceProviderFormBaseProps {
  isEdit?: false;
  onSubmit: (data: CreateServiceProviderInput) => void;
}

interface UpdateServiceProviderFormProps extends ServiceProviderFormBaseProps {
  isEdit: true;
  onSubmit: (data: UpdateServiceProviderInput) => void;
}

type ServiceProviderFormProps =
  | CreateServiceProviderFormProps
  | UpdateServiceProviderFormProps;

const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];


export const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({
  onSubmit,
  defaultValues,
  isEdit = false,
  isLoading = false,
}) => {
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(
    defaultValues?.imagesUrl || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const normalizePhoneContacts = (
    contacts?: Array<{
      phoneNumber: string;
      hasWhatsApp: boolean | string;
      canCall?: boolean | string;
    }>
  ) => {
    if (!contacts || contacts.length === 0) {
      return [{ phoneNumber: "", hasWhatsApp: false, canCall: true }];
    }
    return contacts.map((contact) => ({
      phoneNumber: contact.phoneNumber || "",
      hasWhatsApp:
        typeof contact.hasWhatsApp === "boolean"
          ? contact.hasWhatsApp
          : contact.hasWhatsApp === "true" || contact.hasWhatsApp === "yes",
      canCall:
        typeof contact.canCall === "boolean"
          ? contact.canCall
          : contact.canCall === undefined || contact.canCall === null
            ? true
            : contact.canCall === "true" || contact.canCall === "yes",
    }));
  };

  const defaultFormValues = {
    name: defaultValues?.name || "",
    bio: defaultValues?.bio || "",
    workingDays: defaultValues?.workingDays || [],
    workingHour: defaultValues?.workingHour || "",
    closingHour: defaultValues?.closingHour || "",
    phoneContacts: normalizePhoneContacts(defaultValues?.phoneContacts),
    locationLinks: defaultValues?.locationLinks || [],
    offers: defaultValues?.offers || [],
  };

  const createForm = useForm<CreateServiceProviderInput>({
    resolver: zodResolver(createServiceProviderSchema),
    defaultValues: { ...defaultFormValues, image: undefined },
  });

  const updateForm = useForm<UpdateServiceProviderInput>({
    resolver: zodResolver(updateServiceProviderSchema),
    defaultValues: { ...defaultFormValues, image: undefined },
  });

  const form = isEdit ? updateForm : createForm;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: "phoneContacts" as any,
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control: form.control,
    name: "locationLinks" as any,
  });

  const {
    fields: offerFields,
    append: appendOffer,
    remove: removeOffer,
  } = useFieldArray({
    control: form.control,
    name: "offers" as any,
  });

  const watchedWorkingDays = Array.isArray(watch("workingDays" as any))
    ? (watch("workingDays" as any) as string[])
    : [];


  const toggleDay = (day: string) => {
    const currentDays = watchedWorkingDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    if (isEdit) {
      (updateForm.setValue as any)("workingDays", newDays);
    } else {
      (createForm.setValue as any)("workingDays", newDays);
    }
  };



  const handleDeleteExistingImage = (publicId: string) => {
    setDeletedImageIds((prev) => [...prev, publicId]);
    setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const newFiles = [...newImages, ...files];
      setNewImages(newFiles);

      // Generate previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      // Update form value
      if (isEdit) {
        (updateForm.setValue as any)("image", newFiles, { shouldValidate: true });
      } else {
        (createForm.setValue as any)("image", newFiles, { shouldValidate: true });
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);

    // Revoke and remove preview
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Update form value
    if (isEdit) {
      (updateForm.setValue as any)("image", updatedImages, { shouldValidate: true });
    } else {
      (createForm.setValue as any)("image", updatedImages, { shouldValidate: true });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (data: any) => {
    if (isEdit) {
      onSubmit({ ...data, deletedImageIds });
    } else {
      onSubmit(data);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Images
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Existing Images */}
          {existingImages.map((img) => (
            <Box
              key={img.public_id}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                "&:hover .delete-overlay": { opacity: 1 },
              }}
            >
              <img
                src={img.url}
                alt="Existing"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                className="delete-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={() => handleDeleteExistingImage(img.public_id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* New Image Previews */}
          {previewUrls.map((url, index) => (
            <Box
              key={url}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                "&:hover .delete-overlay": { opacity: 1 },
              }}
            >
              <img
                src={url}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                className="delete-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={() => handleRemoveNewImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* Add Image Button */}
          <Box
            onClick={triggerFileInput}
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              border: "2px dashed #e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
            }}
          >
            <AddIcon fontSize="large" color="action" />
          </Box>
        </Box>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        {/* Error Message */}
        {(isEdit
          ? updateForm.formState.errors.image
          : createForm.formState.errors.image) && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: "block" }}
            >
              {
                (isEdit
                  ? (updateForm.formState.errors.image?.message as string)
                  : (createForm.formState.errors.image?.message as string))
              }
            </Typography>
          )}
      </Box>

      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
        )}
      />

      <Controller
        name="bio"
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Bio"
            fullWidth
            required
            multiline
            rows={4}
            error={!!errors.bio}
            helperText={errors.bio?.message as string}
          />
        )}
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Working Days *
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {DAYS_OF_WEEK.map((day) => (
            <Chip
              key={day}
              label={day}
              onClick={() => toggleDay(day)}
              color={watchedWorkingDays.includes(day) ? "primary" : "default"}
              variant={watchedWorkingDays.includes(day) ? "filled" : "outlined"}
            />
          ))}
        </Stack>
        {errors.workingDays && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, display: "block" }}
          >
            {errors.workingDays.message as string}
          </Typography>
        )}
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={2}>
          <Controller
            name="workingHour"
            control={form.control}
            render={({ field }) => (
              <TimePicker
                label="Opening Hour"
                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.format('HH:mm') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!(errors as any).workingHour,
                    helperText: (errors as any).workingHour?.message as string
                  }
                }}
              />
            )}
          />
          <Controller
            name="closingHour"
            control={form.control}
            render={({ field }) => (
              <TimePicker
                label="Closing Hour"
                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.format('HH:mm') : '');
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!(errors as any).closingHour,
                    helperText: (errors as any).closingHour?.message as string
                  }
                }}
              />
            )}
          />
        </Stack>
      </LocalizationProvider>

      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle2">Phone Contacts *</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() =>
              appendPhone({
                phoneNumber: "",
                hasWhatsApp: false,
                canCall: true,
              } as any)
            }
          >
            Add Contact
          </Button>
        </Box>
        {phoneFields.map((field, index) => (
          <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={2}>
              <Controller
                name={`phoneContacts.${index}.phoneNumber` as any}
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    required
                    placeholder="+1234567890 or 123-456-7890"
                    inputProps={{
                      pattern:
                        "[\\+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}",
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      const filteredValue = value.replace(
                        /[^0-9+\-()\s.]/g,
                        ""
                      );
                      field.onChange(filteredValue);
                    }}
                    error={
                      !!(errors.phoneContacts as any)?.[index]?.phoneNumber
                    }
                    helperText={
                      (errors.phoneContacts as any)?.[index]?.phoneNumber
                        ?.message as string
                    }
                  />
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name={`phoneContacts.${index}.hasWhatsApp` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Has WhatsApp</InputLabel>
                      <Select
                        {...field}
                        value={field.value ? "yes" : "no"}
                        onChange={(e) =>
                          field.onChange(e.target.value === "yes")
                        }
                        label="Has WhatsApp"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name={`phoneContacts.${index}.canCall` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Can Call</InputLabel>
                      <Select
                        {...field}
                        value={field.value ? "yes" : "no"}
                        onChange={(e) =>
                          field.onChange(e.target.value === "yes")
                        }
                        label="Can Call"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                {phoneFields.length > 1 && (
                  <IconButton onClick={() => removePhone(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Paper>
        ))}
        {errors.phoneContacts &&
          typeof errors.phoneContacts.message === "string" && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, display: "block" }}
            >
              {errors.phoneContacts.message}
            </Typography>
          )}
      </Box>

      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle2">Location Links *</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => appendLocation("" as any)}
          >
            Add Location
          </Button>
        </Box>
        {locationFields.map((field, index) => (
          <Box key={field.id} display="flex" gap={1} mb={1}>
            <Controller
              name={`locationLinks.${index}` as any}
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`Location ${index + 1}`}
                  fullWidth
                  required
                  error={!!(errors.locationLinks as any)?.[index]}
                />
              )}
            />
            {locationFields.length > 1 && (
              <IconButton onClick={() => removeLocation(index)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        {errors.locationLinks &&
          typeof errors.locationLinks.message === "string" && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, display: "block" }}
            >
              {errors.locationLinks.message}
            </Typography>
          )}
      </Box>

      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle2">Offers (Optional)</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() =>
              appendOffer({ name: "", description: "", imageUrl: [] } as any)
            }
          >
            Add Offer
          </Button>
        </Box>
        {offerFields.map((field, index) => (
          <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={2}>
              <Controller
                name={`offers.${index}.name` as any}
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Offer Name"
                    fullWidth
                    error={!!(errors.offers as any)?.[index]?.name}
                    helperText={
                      (errors.offers as any)?.[index]?.name?.message as string
                    }
                  />
                )}
              />
              <Controller
                name={`offers.${index}.description` as any}
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Offer Description"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!(errors.offers as any)?.[index]?.description}
                    helperText={
                      (errors.offers as any)?.[index]?.description
                        ?.message as string
                    }
                  />
                )}
              />
              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={() => removeOffer(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};
