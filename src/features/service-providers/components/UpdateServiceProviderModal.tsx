import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Stack,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { ServiceProviderForm } from "./ServiceProviderForm";
import { useUpdateServiceProvider } from "../mutations";
import type { UpdateServiceProviderInput } from "../schemas";
import type { IServiceProvider } from "../../../interfaces";

interface UpdateServiceProviderModalProps {
  open: boolean;
  onClose: () => void;
  serviceProvider: IServiceProvider;
  subCategoryId: string;
}

export const UpdateServiceProviderModal: React.FC<
  UpdateServiceProviderModalProps
> = ({ open, onClose, serviceProvider, subCategoryId }) => {
  const updateMutation = useUpdateServiceProvider(subCategoryId);

  const handleSubmit = async (data: UpdateServiceProviderInput) => {
    try {
      await updateMutation.mutateAsync({
        serviceProviderId: serviceProvider._id!,
        data,
      });
      onClose();
    } catch (error) {
      console.error("Error updating service provider:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
              color: 'secondary.main',
            }}
          >
            <EditIcon />
          </Box>
          <Box>
            <Typography variant="h6" component="span" fontWeight={600}>
              Edit Service Provider
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update {serviceProvider.name}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <ServiceProviderForm
          onSubmit={handleSubmit}
          defaultValues={serviceProvider}
          isEdit={true}
          isLoading={updateMutation.isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
