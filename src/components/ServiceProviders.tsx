import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Card,
    CardContent,
    Paper,
    Avatar,
    Badge,
    Tooltip,
    Fade,
    InputAdornment,
    alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Chip from '@mui/material/Chip';
import {
    getCategories,
    getSubCategories,
    getServiceProviders,
    createServiceProvider,
    updateServiceProvider,
    deleteServiceProvider
} from '../api';
import type { IMainCategory, ISubCategory, IServiceProvider } from '../interfaces';

interface Props {
    subCategoryId: string;
    onBack: () => void;
}

const ServiceProviders: React.FC<Props> = ({ subCategoryId, onBack }) => {
    const [categories, setCategories] = useState<IMainCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(subCategoryId);
    const [serviceProviders, setServiceProviders] = useState<IServiceProvider[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<IServiceProvider[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<IServiceProvider | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<Partial<IServiceProvider>>({
        name: '',
        bio: '',
        workingDays: [],
        phoneContacts: [{ phoneNumber: '', hasWhatsApp: false }],
        locationLinks: [],
        rating: 0,
        completedJobs: 0,
        responseTime: '',
        isVerified: false
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                clearError();
                const response = await getCategories();
                if (response.data.success && response.data.data) {
                    setCategories(response.data.data.categories);
                } else {
                    setError(response.data.message || 'Failed to fetch categories');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch categories');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch sub-categories when category is selected
    useEffect(() => {
        if (selectedCategoryId) {
            const fetchSubCategories = async () => {
                try {
                    setLoading(true);
                    clearError();
                    const response = await getSubCategories(selectedCategoryId);
                    if (response.data.success && response.data.data) {
                        setSubCategories(response.data.data.subCategories);
                    } else {
                        setError(response.data.message || 'Failed to fetch sub-categories');
                    }
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to fetch sub-categories');
                    console.error('Error fetching sub-categories:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSubCategories();
        }
    }, [selectedCategoryId]);

    // Fetch service providers
    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                setLoading(true);
                clearError();
                const currentSubCategoryId = subCategoryId || selectedSubCategoryId;
                if (!currentSubCategoryId) return;

                const response = await getServiceProviders(currentSubCategoryId);
                if (response.data.success && response.data.data) {
                    setServiceProviders(response.data.data.serviceProviders);
                    setFilteredProviders(response.data.data.serviceProviders);
                } else {
                    setError(response.data.message || 'Failed to fetch service providers');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch service providers');
                console.error('Error fetching service providers:', err);
            } finally {
                setLoading(false);
            }
        };

        if (subCategoryId || selectedSubCategoryId) {
            fetchServiceProviders();
        }
    }, [subCategoryId, selectedSubCategoryId]);

    // Search functionality
    useEffect(() => {
        const filtered = serviceProviders.filter(provider =>
            provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.bio?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProviders(filtered);
    }, [searchQuery, serviceProviders]);

    const handleAddProvider = async () => {
        try {
            setLoading(true);
            clearError();

            const currentSubCategoryId = selectedSubCategoryId || subCategoryId;
            if (!currentSubCategoryId) {
                setError('Please select a sub-category');
                return;
            }

            if (!formData.name?.trim()) {
                setError('Provider name is required');
                return;
            }

            if (!formData.bio?.trim()) {
                setError('Provider bio is required');
                return;
            }

            const response = await createServiceProvider(currentSubCategoryId, formData as IServiceProvider);
            if (response.data.success && response.data.data) {
                setServiceProviders([...serviceProviders, response.data.data]);
                setFilteredProviders([...filteredProviders, response.data.data]);
                setDialogOpen(false);
                setFormData({
                    name: '',
                    bio: '',
                    workingDays: [],
                    phoneContacts: [{ phoneNumber: '', hasWhatsApp: false }],
                    locationLinks: [],
                    rating: 0,
                    completedJobs: 0,
                    responseTime: '',
                    isVerified: false
                });
            } else {
                setError(response.data.message || 'Failed to add service provider');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add service provider');
            console.error('Error adding service provider:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProvider = async () => {
        if (!editingProvider?._id) return;
        try {
            setLoading(true);
            clearError();

            // Prepare payload for backend
            const payload: any = {
                name: formData.name,
                bio: formData.bio,
                imagesUrl: formData.imagesUrl || [],
                workingDays: formData.workingDays || [],
                workingHours: formData.workingHours || [],
                closingHours: formData.closingHours || [],
                phoneContacts: formData.phoneContacts || [],
                locationLinks: formData.locationLinks || [],
                offers: formData.offers || [],
            };

            // Remove empty arrays/fields to match backend logic
            Object.keys(payload).forEach(key => {
                if (
                    Array.isArray(payload[key]) && payload[key].length === 0
                ) {
                    delete payload[key];
                }
            });

            const response = await updateServiceProvider(editingProvider._id, payload);
            if (response.data.success && response.data.data && response.data.data.serviceProvider) {
                const updated = response.data.data.serviceProvider;
                setServiceProviders(serviceProviders.map(p => p._id === updated._id ? updated : p));
                setFilteredProviders(filteredProviders.map(p => p._id === updated._id ? updated : p));
                setDialogOpen(false);
                setEditingProvider(null);
                setFormData({
                    name: '',
                    bio: '',
                    workingDays: [],
                    workingHours: [],
                    closingHours: [],
                    phoneContacts: [{ phoneNumber: '', hasWhatsApp: false, canCall: true }],
                    locationLinks: [],
                    imagesUrl: [],
                    offers: [],
                });
            } else {
                setError(response.data.message || 'Failed to update service provider');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update service provider');
            console.error('Error updating service provider:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProvider = async (providerId: string) => {
        if (!window.confirm('Are you sure you want to delete this service provider?')) {
            return;
        }

        try {
            setLoading(true);
            clearError();

            const response = await deleteServiceProvider(providerId);
            if (response.data.success) {
                setServiceProviders(serviceProviders.filter(p => p._id !== providerId));
                setFilteredProviders(filteredProviders.filter(p => p._id !== providerId));
            } else {
                setError(response.data.message || 'Failed to delete service provider');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete service provider');
            console.error('Error deleting service provider:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDialog = (provider?: IServiceProvider) => {
        if (provider) {
            setEditingProvider(provider);
            setFormData({
                name: provider.name || '',
                bio: provider.bio || '',
                workingDays: provider.workingDays || [],
                workingHours: provider.workingHours || [],
                closingHours: provider.closingHours || [],
                phoneContacts: provider.phoneContacts || [{ phoneNumber: '', hasWhatsApp: false, canCall: true }],
                locationLinks: provider.locationLinks || [],
                imagesUrl: provider.imagesUrl || [],
                offers: provider.offers || [],
                rating: provider.rating || 0,
                completedJobs: provider.completedJobs || 0,
                responseTime: provider.responseTime || '',
                isVerified: provider.isVerified || false
            });
        } else {
            setEditingProvider(null);
            setFormData({
                name: '',
                bio: '',
                workingDays: [],
                workingHours: [],
                closingHours: [],
                phoneContacts: [{ phoneNumber: '', hasWhatsApp: false, canCall: true }],
                locationLinks: [],
                imagesUrl: [],
                offers: [],
                rating: 0,
                completedJobs: 0,
                responseTime: '',
                isVerified: false
            });
        }
        setDialogOpen(true);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return '#4caf50';
        if (rating >= 4.0) return '#ff9800';
        return '#f44336';
    };

    const clearError = () => {
        setError(null);
    };

    // Clear error when search query changes
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [searchQuery]);

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', px: 4, py: 2 }}>
            <Box sx={{ width: '100%', maxWidth: '1600px', mx: 'auto' }}>
                {/* Header Section */}
                <Box sx={{ mb: 4, width: '100%' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
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
                            }
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
                                            }
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
                                    onClick={() => openDialog()}
                                    sx={{
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                        }
                                    }}
                                >
                                    Add Provider
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Error Display */}
                {error && (
                    <Paper
                        elevation={1}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            backgroundColor: '#ffebee',
                            border: '1px solid #f44336'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                            <IconButton size="small" onClick={clearError} sx={{ color: '#f44336' }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Paper>
                )}

                {/* Search and Filters Section */}
                <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: alpha('#f5f5f5', 0.5), width: '100%' }}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* Search Bar */}
                        <Box>
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
                                        backgroundColor: alpha('#f5f5f5', 0.5),
                                        '&:hover': {
                                            backgroundColor: alpha('#f5f5f5', 0.8),
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Category Filters */}
                        <Box>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <FilterListIcon color="action" />
                                <Typography variant="h6" fontWeight="600">
                                    Filter by Category
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexWrap="wrap"
                                gap={2}
                            >
                                <FormControl sx={{ minWidth: 250, flex: 1 }}>
                                    <InputLabel id="category-select-label">Category</InputLabel>
                                    <Select
                                        labelId="category-select-label"
                                        value={selectedCategoryId}
                                        label="Category"
                                        onChange={e => setSelectedCategoryId(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {categories.map(cat => (
                                            <MenuItem key={cat._id} value={cat._id}>
                                                {cat.englishName} / {cat.arabicName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 250, flex: 1 }} disabled={!selectedCategoryId}>
                                    <InputLabel id="sub-category-select-label">Sub-category</InputLabel>
                                    <Select
                                        labelId="sub-category-select-label"
                                        value={selectedSubCategoryId}
                                        label="Sub-category"
                                        onChange={e => setSelectedSubCategoryId(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {subCategories.map(sub => (
                                            <MenuItem key={sub._id} value={sub._id}>
                                                {sub.englishName} / {sub.arabicName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Results Header */}
                {filteredProviders.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" color="text.secondary">
                            {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
                            {searchQuery && ` for "${searchQuery}"`}
                        </Typography>
                    </Box>
                )}

                {/* Service Providers Grid */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress size={60} />
                    </Box>
                ) : filteredProviders.length > 0 ? (
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                            xl: 'repeat(4, 1fr)'
                        }}
                        gap={3}
                    >
                        {filteredProviders.map((provider, index) => (
                            <Fade in={true} timeout={300 + index * 100} key={provider._id}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                            '& .provider-actions': {
                                                opacity: 1,
                                                transform: 'translateY(0)',
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {/* Provider Header */}
                                        <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    provider.isVerified ? (
                                                        <Box
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#4caf50',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: '2px solid white'
                                                            }}
                                                        >
                                                            <Typography sx={{ fontSize: 10, color: 'white' }}>✓</Typography>
                                                        </Box>
                                                    ) : null
                                                }
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        backgroundColor: 'primary.main',
                                                        fontSize: '1.2rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {getInitials(provider.name || '')}
                                                </Avatar>
                                            </Badge>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                    <Typography variant="h6" fontWeight="700" noWrap>
                                                        {provider.name || 'Unnamed Provider'}
                                                    </Typography>
                                                    {provider.isVerified && (
                                                        <Tooltip title="Verified Provider">
                                                            <Box sx={{ color: '#4caf50', display: 'flex' }}>
                                                                <StarIcon fontSize="small" />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <StarIcon sx={{ fontSize: 16, color: getRatingColor(provider.rating || 0) }} />
                                                        <Typography variant="body2" fontWeight="600" color={getRatingColor(provider.rating || 0)}>
                                                            {provider.rating?.toFixed(1) || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {provider.completedJobs || 0} jobs completed
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Bio */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 3,
                                                lineHeight: 1.6,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {provider.bio || 'No bio provided'}
                                        </Typography>

                                        {/* Provider Details */}
                                        <Stack spacing={2} sx={{ flex: 1 }}>
                                            {/* Response Time */}
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <AccessTimeIcon fontSize="small" sx={{ color: '#2196f3' }} />
                                                <Typography variant="body2" fontWeight="500">
                                                    Responds {provider.responseTime || 'N/A'}
                                                </Typography>
                                            </Box>

                                            {/* Working Days */}
                                            {provider.workingDays && provider.workingDays.length > 0 && (
                                                <Box>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <ScheduleIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" fontWeight="500">
                                                            Available Days
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                        {provider.workingDays.slice(0, 3).map((day: string) => (
                                                            <Chip
                                                                key={day}
                                                                label={day.slice(0, 3)}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.7rem', height: 20 }}
                                                            />
                                                        ))}
                                                        {provider.workingDays.length > 3 && (
                                                            <Chip
                                                                label={`+${provider.workingDays.length - 3}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.7rem', height: 20 }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Phone Contacts */}
                                            {provider.phoneContacts && provider.phoneContacts.length > 0 && (
                                                <Box>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <PhoneIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" fontWeight="500">
                                                            Contact
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                                        {provider.phoneContacts.slice(0, 2).map((contact: any, idx: number) => (
                                                            <Chip
                                                                key={idx}
                                                                label={contact.phoneNumber}
                                                                size="small"
                                                                icon={contact.hasWhatsApp ? <WhatsAppIcon sx={{ fontSize: 14 }} /> : <PhoneIcon sx={{ fontSize: 14 }} />}
                                                                sx={{
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: contact.hasWhatsApp ? alpha('#25d366', 0.1) : alpha('#2196f3', 0.1),
                                                                    color: contact.hasWhatsApp ? '#25d366' : '#2196f3',
                                                                    '& .MuiChip-icon': {
                                                                        color: 'inherit'
                                                                    }
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Locations */}
                                            {provider.locationLinks && provider.locationLinks.length > 0 && (
                                                <Box>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <LocationOnIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" fontWeight="500">
                                                            Service Areas
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                        {provider.locationLinks.map((location: string, idx: number) => (
                                                            <Chip
                                                                key={idx}
                                                                label={location}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.7rem', height: 20 }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Stack>

                                        {/* Floating Action Buttons */}
                                        <Box
                                            className="provider-actions"
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                right: 16,
                                                display: 'flex',
                                                gap: 1,
                                                opacity: 0,
                                                transform: 'translateY(-10px)',
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            <Tooltip title="Edit Provider">
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        boxShadow: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'primary.light',
                                                            color: 'white'
                                                        }
                                                    }}
                                                    onClick={() => openDialog(provider)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Provider">
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        boxShadow: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'error.light',
                                                            color: 'white'
                                                        }
                                                    }}
                                                    onClick={() => handleDeleteProvider(provider._id || '')}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        ))}
                    </Box>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 8,
                            textAlign: 'center',
                            borderRadius: 3,
                            backgroundColor: alpha('#f5f5f5', 0.5)
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No service providers found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            {searchQuery
                                ? `No providers match your search for "${searchQuery}"`
                                : 'Start by selecting a category to view available providers'
                            }
                        </Typography>
                        {searchQuery && (
                            <Button
                                variant="outlined"
                                onClick={() => setSearchQuery('')}
                                sx={{ borderRadius: 2 }}
                            >
                                Clear Search
                            </Button>
                        )}
                    </Paper>
                )}

                {/* Dialog for Add/Edit Provider */}
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>{editingProvider ? 'Edit Service Provider' : 'Add Service Provider'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField
                                label="Service Provider Name"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Bio"
                                value={formData.bio || ''}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                multiline
                                rows={2}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Images URL (comma separated)"
                                value={formData.imagesUrl?.map(img => img.url).join(',') || ''}
                                onChange={(e) => setFormData({ ...formData, imagesUrl: e.target.value.split(',').map((url) => ({ url: url.trim(), public_id: '', _id: '' })).filter((img) => !!img.url) })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Working Days (comma separated)"
                                value={formData.workingDays?.join(',') || ''}
                                onChange={(e) => setFormData({ ...formData, workingDays: e.target.value.split(',').map((d) => d.trim()).filter((d) => !!d) })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Working Hours (comma separated)"
                                value={formData.workingHours?.join(',') || ''}
                                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value.split(',').map((h) => h.trim()).filter((h) => !!h) })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Closing Hours (comma separated)"
                                value={formData.closingHours?.join(',') || ''}
                                onChange={(e) => setFormData({ ...formData, closingHours: e.target.value.split(',').map((h) => h.trim()).filter((h) => !!h) })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Location Links (comma separated)"
                                value={formData.locationLinks?.join(',') || ''}
                                onChange={(e) => setFormData({ ...formData, locationLinks: e.target.value.split(',').map((l) => l.trim()).filter((l) => !!l) })}
                                fullWidth
                                required
                            />

                            {/* Phone Contacts Dynamic List */}
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Phone Contacts</Typography>
                                {formData.phoneContacts?.map((contact, idx) => (
                                    <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                                        <TextField
                                            label="Phone Number"
                                            value={contact.phoneNumber}
                                            onChange={e => {
                                                const updated = [...(formData.phoneContacts || [])];
                                                updated[idx] = { ...updated[idx], phoneNumber: e.target.value };
                                                setFormData({ ...formData, phoneContacts: updated });
                                            }}
                                            sx={{ flex: 2 }}
                                        />
                                        <FormControl sx={{ minWidth: 80 }}>
                                            <InputLabel>WhatsApp</InputLabel>
                                            <Select
                                                value={contact.hasWhatsApp ? 'Yes' : 'No'}
                                                label="WhatsApp"
                                                onChange={e => {
                                                    const updated = [...(formData.phoneContacts || [])];
                                                    updated[idx] = { ...updated[idx], hasWhatsApp: e.target.value === 'Yes' };
                                                    setFormData({ ...formData, phoneContacts: updated });
                                                }}
                                            >
                                                <MenuItem value="Yes">Yes</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl sx={{ minWidth: 80 }}>
                                            <InputLabel>Can Call</InputLabel>
                                            <Select
                                                value={contact.canCall ? 'Yes' : 'No'}
                                                label="Can Call"
                                                onChange={e => {
                                                    const updated = [...(formData.phoneContacts || [])];
                                                    updated[idx] = { ...updated[idx], canCall: e.target.value === 'Yes' };
                                                    setFormData({ ...formData, phoneContacts: updated });
                                                }}
                                            >
                                                <MenuItem value="Yes">Yes</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button
                                            color="error"
                                            onClick={() => {
                                                const updated = (formData.phoneContacts || []).filter((_, i) => i !== idx);
                                                setFormData({ ...formData, phoneContacts: updated });
                                            }}
                                        >
                                            REMOVE
                                        </Button>
                                    </Box>
                                ))}
                                <Button
                                    onClick={() => setFormData({
                                        ...formData,
                                        phoneContacts: [
                                            ...(formData.phoneContacts || []),
                                            { phoneNumber: '', hasWhatsApp: false, canCall: true }
                                        ]
                                    })}
                                    sx={{ mt: 1 }}
                                >
                                    ADD PHONE CONTACT
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={editingProvider ? handleUpdateProvider : handleAddProvider}
                            variant="contained"
                            disabled={loading}
                        >
                            {editingProvider ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ServiceProviders;