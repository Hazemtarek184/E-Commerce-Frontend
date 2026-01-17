import { Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useState } from 'react';
import { ServiceProviderForm } from './ServiceProviderForm';
import { useCreateServiceProvider } from '../mutations';
import type { CreateServiceProviderInput } from '../schemas';
import { useCategories } from '../../../hooks/useCategories';
import { useSubCategories } from '../../../hooks/useSubCategories';

interface CreateServiceProviderModalProps {
  open: boolean;
  onClose: () => void;
  subCategoryId: string;
  mainCategoryId?: string;
}

export const CreateServiceProviderModal: React.FC<CreateServiceProviderModalProps> = ({
  open,
  onClose,
  subCategoryId: initialSubCategoryId,
  mainCategoryId: initialMainCategoryId,
}) => {
  const createMutation = useCreateServiceProvider();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialMainCategoryId || '');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(initialSubCategoryId || '');

  const { data: categories = [] } = useCategories();
  const { data: subCategories = [], isLoading: subCategoriesLoading } = useSubCategories(selectedCategoryId);

  const handleSubmit = async (data: CreateServiceProviderInput) => {
    if (!selectedSubCategoryId) {
      return;
    }
    try {
      await createMutation.mutateAsync({ subCategoryId: selectedSubCategoryId, data });
      onClose();
    } catch (error) {
      console.error('Error creating service provider:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Service Provider</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubCategoryId(''); // Reset subcategory when category changes
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedCategoryId || subCategoriesLoading}>
            <InputLabel>Sub-Category</InputLabel>
            <Select
              value={selectedSubCategoryId}
              label="Sub-Category"
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
            >
              {subCategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ServiceProviderForm
          onSubmit={handleSubmit}
          isEdit={false}
          isLoading={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
