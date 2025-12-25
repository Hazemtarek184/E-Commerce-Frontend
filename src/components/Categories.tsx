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
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import type { IMainCategory } from '../interfaces';

interface Props {
    onSelectCategory: (id: string) => void;
}

const Categories: React.FC<Props> = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState<IMainCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<IMainCategory | null>(null);
    const [englishName, setEnglishName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<IMainCategory[]>([]);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCategories();
            const apiCategories = res.data?.data?.categories;
            if (res.data && res.data.success && Array.isArray(apiCategories)) {
                setCategories(apiCategories);
                setFilteredCategories(apiCategories);
            } else {
                setCategories([]);
                setFilteredCategories([]);
                setError(res.data?.message || 'Failed to fetch categories');
            }
        } catch (err: any) {
            setCategories([]);
            setFilteredCategories([]);
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Search functionality
    useEffect(() => {
        const filtered = categories.filter(category =>
            category.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.arabicName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchQuery, categories]);

    const handleOpenDialog = (category?: IMainCategory) => {
        setEditCategory(category || null);
        setEnglishName(category?.englishName || '');
        setArabicName(category?.arabicName || '');
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditCategory(null);
        setEnglishName('');
        setArabicName('');
    };

    const handleSave = async () => {
        try {
            if (editCategory && editCategory._id) {
                await updateCategory(editCategory._id, { englishName, arabicName });
            } else {
                await createCategory({ englishName, arabicName });
            }
            fetchCategories();
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message || 'Failed to save category');
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await deleteCategory(categoryId);
            fetchCategories();
        } catch (err: any) {
            setError(err.message || 'Failed to delete category');
        }
    };

    const clearError = () => setError(null);

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
                                <CategoryIcon sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h4" fontWeight="700" gutterBottom>
                                        Categories
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                        Manage your main service categories
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
                                Add Category
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

            {/* Search Section */}
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: alpha('#f5f5f5', 0.5) }}>
                <TextField
                    fullWidth
                    placeholder="Search categories by name..."
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
            </Paper>

            {/* Content Section */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress size={60} />
                </Box>
            ) : filteredCategories.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: alpha('#f5f5f5', 0.5)
                    }}
                >
                    <CategoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No categories found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {searchQuery ? `No categories match "${searchQuery}"` : 'Get started by adding a category'}
                    </Typography>
                </Paper>
            ) : (
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
                    {filteredCategories.map((cat, index) => (
                        <Fade in={true} timeout={300 + index * 100} key={cat._id}>
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
                                        '& .category-actions': {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                        }
                                    }
                                }}
                                onClick={() => onSelectCategory(cat._id!)}
                            >
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                            <CategoryIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="h6" fontWeight="700" noWrap>
                                                {cat.englishName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {cat.arabicName}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack spacing={2} sx={{ flex: 1 }}>
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
                                    </Stack>

                                    <Box
                                        className="category-actions"
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
                                        <Tooltip title="Edit Category">
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
                                                    handleOpenDialog(cat);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Category">
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
                                                    handleDelete(cat._id!);
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
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            autoFocus
                            label="English Name"
                            fullWidth
                            value={englishName}
                            onChange={e => setEnglishName(e.target.value)}
                        />
                        <TextField
                            label="Arabic Name"
                            fullWidth
                            value={arabicName}
                            onChange={e => setArabicName(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!englishName || !arabicName}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Categories; 