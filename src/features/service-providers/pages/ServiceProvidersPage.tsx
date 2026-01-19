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
  IconButton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const fetchError = error instanceof Error ? error.message : error ? t('common.error') : null;
  const selectedSubCategory = subCategories.find((sub) => sub._id === currentSubCategoryId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader
        title={t('service_providers.title')}
        subtitle={selectedSubCategory ? t('service_providers.in_subcategory', { subcategory: selectedSubCategory.englishName }) : t('service_providers.subtitle')}
        icon={<PeopleIcon />}
        actionButtonText={t('service_providers.add_provider')}
        onAction={() => setCreateModalOpen(true)}
        backButton={
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        }
      />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <ErrorDisplay error={fetchError} />

        {/* Filters */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('service_providers.search_placeholder')}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>{t('service_providers.filter_category')}</InputLabel>
            <Select
              value={currentCategoryId}
              label={t('service_providers.filter_category')}
              onChange={(e) => {
                setCurrentCategoryId(e.target.value);
                setCurrentSubCategoryId('');
              }}
              sx={{ bgcolor: 'background.paper' }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }} disabled={!currentCategoryId}>
            <InputLabel>{t('service_providers.filter_subcategory')}</InputLabel>
            <Select
              value={currentSubCategoryId}
              label={t('service_providers.filter_subcategory')}
              onChange={(e) => setCurrentSubCategoryId(e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              {subCategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <DataStateDisplay
          loading={isLoading}
          empty={filteredProviders.length === 0}
          emptyIcon={<PeopleIcon />}
          emptyTitle={t('service_providers.no_providers')}
          emptyMessage={
            searchQuery
              ? t('service_providers.no_providers_match', { query: searchQuery })
              : t('service_providers.no_in_subcategory')
          }
          onClearSearch={searchQuery ? () => setSearchQuery('') : undefined}
        >
          <ServiceProviderList
            providers={filteredProviders}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </DataStateDisplay>
      </Box>

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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('service_providers.delete_confirmation')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('common.confirm_delete')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t('common.loading') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
