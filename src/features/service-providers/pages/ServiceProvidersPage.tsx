import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  alpha,
  IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useServiceProviders } from '../queries';
import { useDeleteServiceProvider } from '../mutations';
import { ServiceProviderList } from '../components/ServiceProviderList';
import { CreateServiceProviderModal } from '../components/CreateServiceProviderModal';
import { UpdateServiceProviderModal } from '../components/UpdateServiceProviderModal';
import type { IServiceProvider } from '../../../interfaces';

import { useCategories } from '../../../hooks/useCategories';
import { useSubCategories } from '../../../hooks/useSubCategories';
import { PageHeader } from '../../../components/common/PageHeader';
import { ErrorDisplay } from '../../../components/common/ErrorDisplay';
import { SearchBar } from '../../../components/common/SearchBar';
import { DataStateDisplay } from '../../../components/common/DataStateDisplay';

interface ServiceProvidersPageProps {
  subCategoryId: string;
  onBack: () => void;
  mainCategoryId?: string;
}

export const ServiceProvidersPage: React.FC<ServiceProvidersPageProps> = ({
  subCategoryId: initialSubCategoryId,
  onBack,
  mainCategoryId: initialMainCategoryId,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IServiceProvider | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);

  // Navigation / Filter State
  const [currentCategoryId, setCurrentCategoryId] = useState<string>(initialMainCategoryId || '');
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState<string>(initialSubCategoryId);

  // Hooks
  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories(currentCategoryId);
  const { data, isLoading, error } = useServiceProviders(currentSubCategoryId);
  const deleteMutation = useDeleteServiceProvider(currentSubCategoryId);

  // Sync props to state if they change
  useEffect(() => {
    if (initialMainCategoryId) setCurrentCategoryId(initialMainCategoryId);
    if (initialSubCategoryId) setCurrentSubCategoryId(initialSubCategoryId);
  }, [initialMainCategoryId, initialSubCategoryId]);

  const serviceProviders = data?.data?.serviceProviders || [];
  const filteredProviders = serviceProviders.filter(
    (provider) =>
      provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (provider: IServiceProvider) => {
    setSelectedProvider(provider);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (providerId: string) => {
    setProviderToDelete(providerId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (providerToDelete) {
      try {
        await deleteMutation.mutateAsync(providerToDelete);
        setDeleteDialogOpen(false);
        setProviderToDelete(null);
      } catch (error) {
        console.error('Error deleting service provider:', error);
      }
    }
  };

  const fetchError = error instanceof Error ? error.message : (error ? 'Failed to fetch service providers' : null);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', px: 4, py: 2 }}>
      <Box sx={{ width: '100%', maxWidth: '1600px', mx: 'auto' }}>
        <PageHeader
          title="Service Providers"
          subtitle="Find and manage professional service providers"
          actionButtonText="Add Provider"
          onAction={() => setCreateModalOpen(true)}
          icon={
            <IconButton
              onClick={onBack}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          }
        />

        <ErrorDisplay error={fetchError} />

        {/* Filters Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: alpha('#f5f5f5', 0.5) }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" gap={2} alignItems="center">
              <FilterListIcon color="action" />
              <Typography variant="h6" fontWeight="600">Filters</Typography>
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentCategoryId}
                  label="Category"
                  onChange={(e) => {
                    setCurrentCategoryId(e.target.value);
                    setCurrentSubCategoryId('');
                  }}
                  sx={{ backgroundColor: 'white' }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.englishName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200, flex: 1 }} disabled={!currentCategoryId}>
                <InputLabel>Sub-Category</InputLabel>
                <Select
                  value={currentSubCategoryId}
                  label="Sub-Category"
                  onChange={(e) => setCurrentSubCategoryId(e.target.value)}
                  sx={{ backgroundColor: 'white' }}
                >
                  {subCategories.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.englishName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search providers by name or bio..."
            />
          </Box>
        </Paper>

        {filteredProviders.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </Typography>
          </Box>
        )}

        <DataStateDisplay
          loading={isLoading}
          empty={filteredProviders.length === 0}
          emptyIcon={<PeopleIcon />}
          emptyTitle="No service providers found"
          emptyMessage={
            searchQuery
              ? `No providers match your search for "${searchQuery}"`
              : 'Start by adding a service provider'
          }
          onClearSearch={searchQuery ? () => setSearchQuery('') : undefined}
        >
          <ServiceProviderList
            providers={filteredProviders}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </DataStateDisplay>

        <CreateServiceProviderModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          subCategoryId={currentSubCategoryId}
          mainCategoryId={currentCategoryId}
        />

        {selectedProvider && (
          <UpdateServiceProviderModal
            open={updateModalOpen}
            onClose={() => {
              setUpdateModalOpen(false);
              setSelectedProvider(null);
            }}
            serviceProvider={selectedProvider}
            subCategoryId={currentSubCategoryId}
          />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Service Provider</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this service provider? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
