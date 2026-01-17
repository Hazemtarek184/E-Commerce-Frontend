import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Card,
    CardContent,
    Avatar,
    Tooltip,
    Fade,
    Container,
    Typography,
    Stack,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';

import type { IMainCategory } from '../interfaces';
import { useCategories, useCategoryMutations } from '../hooks/useCategories';
import { PageHeader } from './common/PageHeader';
import { ErrorDisplay } from './common/ErrorDisplay';
import { SearchBar } from './common/SearchBar';
import { DataStateDisplay } from './common/DataStateDisplay';

interface Props {
    onSelectCategory: (id: string) => void;
}

const Categories: React.FC<Props> = ({ onSelectCategory }) => {
    const { data: categories = [], isLoading, error: queryError } = useCategories();
    const { create, update, remove } = useCategoryMutations();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<IMainCategory | null>(null);
    const [englishName, setEnglishName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<IMainCategory[]>([]);

    // Search functionality
    useEffect(() => {
        if (!categories) return;
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
        if (editCategory && editCategory._id) {
            await update.mutateAsync({ id: editCategory._id, data: { englishName, arabicName } });
        } else {
            await create.mutateAsync({ englishName, arabicName });
        }
        handleCloseDialog();
    };

    const handleDelete = async (categoryId: string) => {
        if (!window.confirm('Delete this category?')) return;
        await remove.mutateAsync(categoryId);
    };

    const mutationError = create.error || update.error || remove.error;
    const errorMessage = mutationError ? (mutationError as any).response?.data?.message || mutationError.message : null;
    const fetchError = queryError ? (queryError as any).message : null;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <PageHeader
                title="Categories"
                subtitle="Manage your main service categories"
                icon={<CategoryIcon sx={{ fontSize: 40 }} />}
                actionButtonText="Add Category"
                onAction={() => handleOpenDialog()}
            />

            <ErrorDisplay error={errorMessage || fetchError} />

            <Box mb={4}>
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search categories by name..."
                />
            </Box>

            <DataStateDisplay
                loading={isLoading}
                empty={filteredCategories.length === 0}
                emptyIcon={<CategoryIcon />}
                emptyTitle="No categories found"
                emptyMessage={searchQuery ? `No categories match "${searchQuery}"` : 'Get started by adding a category'}
                onClearSearch={searchQuery ? () => setSearchQuery('') : undefined}
            >
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
                                onClick={() => cat._id && onSelectCategory(cat._id)}
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
                                                    if (cat._id) handleDelete(cat._id);
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
            </DataStateDisplay>

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
                    <Button onClick={handleSave} variant="contained" disabled={!englishName || !arabicName || create.isPending || update.isPending}>
                        {create.isPending || update.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Categories;
