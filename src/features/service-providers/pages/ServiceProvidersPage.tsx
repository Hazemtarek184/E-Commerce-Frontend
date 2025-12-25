import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useServiceProviders } from '../queries';
import { useDeleteServiceProvider } from '../mutations';
import { ServiceProviderList } from '../components/ServiceProviderList';
import { CreateServiceProviderModal } from '../components/CreateServiceProviderModal';
import { UpdateServiceProviderModal } from '../components/UpdateServiceProviderModal';
import type { IServiceProvider, IMainCategory, ISubCategory } from '../../../interfaces';
import { getCategories, getSubCategories } from '../../../api';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IServiceProvider | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);

  // Navigation State
  const [currentCategoryId, setCurrentCategoryId] = useState<string>(initialMainCategoryId || '');
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState<string>(initialSubCategoryId);
  const [categories, setCategories] = useState<IMainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.data?.success && Array.isArray(res.data.data?.categories)) {
          setCategories(res.data.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCats();
  }, []);

  // Fetch SubCategories when Category changes
  useEffect(() => {
    const fetchSubCats = async () => {
      if (!currentCategoryId) {
        setSubCategories([]);
        return;
      }
      try {
        const res = await getSubCategories(currentCategoryId);
        if (res.data?.success && Array.isArray(res.data.data?.subCategories)) {
          setSubCategories(res.data.data.subCategories);
        }
      } catch (error) {
        console.error('Error fetching sub-categories:', error);
        setSubCategories([]);
      }
    };
    fetchSubCats();
  }, [currentCategoryId]);

  // Update logic when props change (if user navigates from sidebar while on this page)
  useEffect(() => {
    if (initialMainCategoryId) setCurrentCategoryId(initialMainCategoryId);
    if (initialSubCategoryId) setCurrentSubCategoryId(initialSubCategoryId);
  }, [initialMainCategoryId, initialSubCategoryId]);


  const { data, isLoading, error } = useServiceProviders(currentSubCategoryId);
  const deleteMutation = useDeleteServiceProvider(currentSubCategoryId);

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

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', px: 4, py: 2 }}>
      <Box sx={{ width: '100%', maxWidth: '1600px', mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
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
                <Box>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    Service Providers
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Find and manage professional service providers
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => setCreateModalOpen(true)}
                sx={{
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                Add Provider
              </Button>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
            }}
          >
            <Typography color="error" variant="body2">
              {error instanceof Error ? error.message : 'Failed to fetch service providers'}
            </Typography>
          </Paper>
        )}

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
            <TextField
              fullWidth
              placeholder="Search providers by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                },
              }}
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

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : filteredProviders.length > 0 ? (
          <ServiceProviderList
            providers={filteredProviders}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: alpha('#f5f5f5', 0.5),
            }}
          >
            <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No service providers found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchQuery
                ? `No providers match your search for "${searchQuery}"`
                : 'Start by adding a service provider'}
            </Typography>
            {searchQuery && (
              <Button variant="outlined" onClick={() => setSearchQuery('')} sx={{ borderRadius: 2 }}>
                Clear Search
              </Button>
            )}
          </Paper>
        )}

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

