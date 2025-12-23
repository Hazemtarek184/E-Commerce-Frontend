import { Dialog, DialogTitle, DialogContent } from "@mui/material";
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Service Provider</DialogTitle>
      <DialogContent>
        <ServiceProviderForm
          onSubmit={handleSubmit}
          defaultValues={serviceProvider}
          isEdit={true}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
