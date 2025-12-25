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
    Card,
    CardContent,
    Paper,
    Avatar,
    Tooltip,
    Fade,
    Container,
    InputAdornment,
    alpha,
    Stack,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory, getCategories } from '../api';
import type { ISubCategory, IMainCategory } from '../interfaces';

interface Props {
    mainCategoryId: string;
    onSelectSubCategory: (id: string) => void;
    onBack: () => void;
}

const SubCategories: React.FC<Props> = ({ mainCategoryId, onSelectSubCategory, onBack }) => {
    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
    const [categories, setCategories] = useState<IMainCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(mainCategoryId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editSubCategory, setEditSubCategory] = useState<ISubCategory | null>(null);
    const [englishName, setEnglishName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSubCategories, setFilteredSubCategories] = useState<ISubCategory[]>([]);
    const [dialogSelectedCategoryId, setDialogSelectedCategoryId] = useState('');

    // Fetch all categories for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                clearError();
                const res = await getCategories();
                const apiCategories = res.data?.data?.categories;
                if (res.data && res.data.success && Array.isArray(apiCategories)) {
                    setCategories(apiCategories);
                } else {
                    setCategories([]);
                    setError(res.data?.message || 'Failed to fetch categories');
                }
            } catch (err: any) {
                setCategories([]);
                setError(err.response?.data?.message || 'Failed to fetch categories');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch sub-categories when selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId) fetchSubCategories(selectedCategoryId);
        // Update dialog selection defaults when page selection changes
        if (!dialogOpen) {
            setDialogSelectedCategoryId(selectedCategoryId || '');
        }
    }, [selectedCategoryId]);

    // Search functionality
    useEffect(() => {
        const filtered = subCategories.filter(subCategory =>
            subCategory.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subCategory.arabicName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSubCategories(filtered);
    }, [searchQuery, subCategories]);

    const fetchSubCategories = async (categoryId: string) => {
        setLoading(true);
        clearError();
        try {
            const res = await getSubCategories(categoryId);
            console.log('SubCategories API response:', res.data);
            const apiSubCategories = res.data?.data?.subCategories;
            if (res.data.success && Array.isArray(apiSubCategories)) {
                setSubCategories(apiSubCategories);
                setFilteredSubCategories(apiSubCategories);
            } else {
                setSubCategories([]);
                setFilteredSubCategories([]);
                setError(res.data?.message || 'Failed to fetch sub-categories');
            }
        } catch (err: any) {
            setSubCategories([]);
            setFilteredSubCategories([]);
            setError(err.response?.data?.message || 'Failed to fetch sub-categories');
            console.error('Error fetching sub-categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (subCategory?: ISubCategory) => {
        setEditSubCategory(subCategory || null);
        setEnglishName(subCategory?.englishName || '');
        setArabicName(subCategory?.arabicName || '');
        // If editing, we assume it belongs to the currently viewed category (since we don't have parent ID in object)
        // If creating, we default to currently viewed category, or the first available if none selected.
        setDialogSelectedCategoryId(selectedCategoryId || categories[0]?._id || '');
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditSubCategory(null);
        setEnglishName('');
        setArabicName('');
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            clearError();

            if (!englishName.trim()) {
                setError('English name is required');
                return;
            }

            if (!arabicName.trim()) {
                setError('Arabic name is required');
                return;
            }

            if (!dialogSelectedCategoryId) {
                setError('Category is required');
                return;
            }

            if (editSubCategory && editSubCategory._id) {
                // Update currently only supports name changes based on API signature.
                const response = await updateSubCategory(editSubCategory._id, { englishName, arabicName });
                if (response.data.success) {
                    fetchSubCategories(selectedCategoryId);
                    handleCloseDialog();
                } else {
                    setError(response.data.message || 'Failed to update sub-category');
                }
            } else {
                // Create with the selected category from the dialog
                const response = await createSubCategory(dialogSelectedCategoryId, { englishName, arabicName });
                if (response.data.success) {
                    // If we added to the CURRENTLY viewed category, refresh.
                    if (dialogSelectedCategoryId === selectedCategoryId) {
                        fetchSubCategories(selectedCategoryId);
                    }
                    handleCloseDialog();
                } else {
                    setError(response.data.message || 'Failed to create sub-category');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save sub-category');
            console.error('Error saving sub-category:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subCategoryId: string) => {
        if (!window.confirm('Are you sure you want to delete this sub-category?')) {
            return;
        }

        try {
            setLoading(true);
            clearError();

            const response = await deleteSubCategory(subCategoryId);
            if (response.data.success) {
                fetchSubCategories(selectedCategoryId);
            } else {
                setError(response.data.message || 'Failed to delete sub-category');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete sub-category');
            console.error('Error deleting sub-category:', err);
        } finally {
            setLoading(false);
        }
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

    const getSelectedCategoryName = () => {
        const category = categories.find(cat => cat._id === selectedCategoryId);
        return category ? `${category.englishName} / ${category.arabicName}` : 'Select Category';
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
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
                                        Sub-Categories
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                        Manage and organize sub-categories for better service organization
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="large"
                                onClick={() => handleOpenDialog()}
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
                                Add Sub-Category
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
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: alpha('#f5f5f5', 0.5) }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    {/* Search Bar */}
                    <Box>
                        <TextField
                            fullWidth
                            placeholder="Search sub-categories by name..."
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

                    {/* Category Filter */}
                    <Box>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <FilterListIcon color="action" />
                            <Typography variant="h6" fontWeight="600">
                                Filter by Category
                            </Typography>
                        </Box>
                        <FormControl fullWidth>
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
                    </Box>
                </Box>
            </Paper>

            {/* Results Header */}
            {filteredSubCategories.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {filteredSubCategories.length} sub-categor{filteredSubCategories.length !== 1 ? 'ies' : 'y'} found
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategoryId && ` in ${getSelectedCategoryName()}`}
                    </Typography>
                </Box>
            )}

            {/* Sub-Categories Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress size={60} />
                </Box>
            ) : filteredSubCategories.length > 0 ? (
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
                    {filteredSubCategories.map((subCategory, index) => (
                        <Fade in={true} timeout={300 + index * 100} key={subCategory._id}>
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
                                        '& .subcategory-actions': {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                        }
                                    }
                                }}
                                onClick={() => onSelectSubCategory(subCategory._id!)}
                            >
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Sub-Category Header */}
                                    <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                backgroundColor: 'primary.main',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <FolderIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="h6" fontWeight="700" noWrap>
                                                {subCategory.englishName || 'Unnamed Sub-Category'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {subCategory.arabicName || 'بدون اسم'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Sub-Category Details */}
                                    <Stack spacing={2} sx={{ flex: 1 }}>
                                        {/* Language Indicators */}
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            <Chip
                                                icon={<LanguageIcon />}
                                                label="English"
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem', height: 20 }}
                                            />
                                            <Chip
                                                icon={<TranslateIcon />}
                                                label="العربية"
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem', height: 20 }}
                                            />
                                        </Box>

                                        {/* Names Display */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <strong>English:</strong> {subCategory.englishName || 'Not specified'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>العربية:</strong> {subCategory.arabicName || 'غير محدد'}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Floating Action Buttons */}
                                    <Box
                                        className="subcategory-actions"
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
                                        <Tooltip title="Edit Sub-Category">
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDialog(subCategory);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Sub-Category">
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(subCategory._id!);
                                                }}
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
                    <FolderIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No sub-categories found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {searchQuery
                            ? `No sub-categories match your search for "${searchQuery}"`
                            : selectedCategoryId
                                ? 'No sub-categories available for the selected category'
                                : 'Please select a category to view sub-categories'
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

            {/* Dialog for Add/Edit Sub-Category */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="dialog-category-label">Category</InputLabel>
                            <Select
                                labelId="dialog-category-label"
                                value={dialogSelectedCategoryId}
                                label="Category"
                                onChange={(e) => setDialogSelectedCategoryId(e.target.value)}
                                disabled={!!editSubCategory} // Disable when editing
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.englishName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="English Name"
                            value={englishName}
                            onChange={e => setEnglishName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Arabic Name"
                            value={arabicName}
                            onChange={e => setArabicName(e.target.value)}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading || !englishName.trim() || !arabicName.trim() || !dialogSelectedCategoryId}
                    >
                        {editSubCategory ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SubCategories; 