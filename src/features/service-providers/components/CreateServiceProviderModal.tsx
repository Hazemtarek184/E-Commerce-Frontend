import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ServiceProviderForm } from './ServiceProviderForm';
import { useCreateServiceProvider } from '../mutations';
import type { CreateServiceProviderInput } from '../schemas';

interface CreateServiceProviderModalProps {
  open: boolean;
  onClose: () => void;
  subCategoryId: string;
}

export const CreateServiceProviderModal: React.FC<CreateServiceProviderModalProps> = ({
  open,
  onClose,
  subCategoryId,
}) => {
  const createMutation = useCreateServiceProvider(subCategoryId);

  const handleSubmit = async (data: CreateServiceProviderInput) => {
    try {
      await createMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error('Error creating service provider:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Service Provider</DialogTitle>
      <DialogContent>
        <ServiceProviderForm
          onSubmit={handleSubmit}
          isEdit={false}
          isLoading={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

