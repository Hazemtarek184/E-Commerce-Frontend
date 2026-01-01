// @ts-nocheck
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";

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
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
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
    workingHours: defaultValues?.workingHours || [],
    closingHours: defaultValues?.closingHours || [],
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
  const watchedWorkingHours = Array.isArray(watch("workingHours" as any))
    ? (watch("workingHours" as any) as string[])
    : [];
  const watchedClosingHours = Array.isArray(watch("closingHours" as any))
    ? (watch("closingHours" as any) as string[])
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

  const toggleTime = (time: string, field: "workingHours" | "closingHours") => {
    const currentTimes =
      field === "workingHours" ? watchedWorkingHours : watchedClosingHours;
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter((t) => t !== time)
      : [...currentTimes, time];
    if (isEdit) {
      (updateForm.setValue as any)(field, newTimes);
    } else {
      (createForm.setValue as any)(field, newTimes);
    }
  };

  const handleDeleteExistingImage = (publicId: string) => {
    setDeletedImageIds((prev) => [...prev, publicId]);
    setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
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
        {isEdit && existingImages.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Current Images:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {existingImages.map((img) => (
                <Box
                  key={img.public_id}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: "hidden",
                    "&:hover .delete-overlay": {
                      opacity: 1,
                    },
                  }}
                >
                  <img
                    src={img.url}
                    alt="Service Provider"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    className="delete-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
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
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Controller
          name="image"
          control={isEdit ? updateForm.control : createForm.control}
          render={({ field: { onChange, ref, name, onBlur } }) => (
            <TextField
              type="file"
              inputProps={{ accept: "image/*", ref, multiple: true }}
              name={name}
              onBlur={onBlur}
              onChange={(e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  onChange(Array.from(files));
                }
              }}
              error={
                isEdit
                  ? !!updateForm.formState.errors.image
                  : !!createForm.formState.errors.image
              }
              helperText={
                isEdit
                  ? (updateForm.formState.errors.image?.message as string)
                  : (createForm.formState.errors.image?.message as string)
              }
              label={isEdit ? "Add New Images (Optional)" : "Images"}
              fullWidth
            />
          )}
        />
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

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Working Hours *
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {TIME_SLOTS.map((time) => (
            <Chip
              key={time}
              label={time}
              onClick={() => toggleTime(time, "workingHours")}
              color={watchedWorkingHours.includes(time) ? "primary" : "default"}
              variant={
                watchedWorkingHours.includes(time) ? "filled" : "outlined"
              }
            />
          ))}
        </Stack>
        {errors.workingHours && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, display: "block" }}
          >
            {errors.workingHours.message as string}
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Closing Hours *
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {TIME_SLOTS.map((time) => (
            <Chip
              key={time}
              label={time}
              onClick={() => toggleTime(time, "closingHours")}
              color={watchedClosingHours.includes(time) ? "primary" : "default"}
              variant={
                watchedClosingHours.includes(time) ? "filled" : "outlined"
              }
            />
          ))}
        </Stack>
        {errors.closingHours && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, display: "block" }}
          >
            {errors.closingHours.message as string}
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
