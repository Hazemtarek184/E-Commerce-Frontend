import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Stack,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
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
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <AddBusinessIcon />
          </Box>
          <Box>
            <Typography variant="h6" component="span" fontWeight={600}>
              Add Service Provider
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new service provider listing
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

      <DialogContent sx={{ pt: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubCategoryId('');
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!selectedCategoryId || subCategoriesLoading}>
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
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
