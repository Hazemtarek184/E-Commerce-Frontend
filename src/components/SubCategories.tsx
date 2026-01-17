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
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Avatar,
    Tooltip,
    Fade,
    Container,
    Stack,
    Chip,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';

import type { ISubCategory } from '../interfaces';
import { useSubCategories, useSubCategoryMutations } from '../hooks/useSubCategories';
import { useCategories } from '../hooks/useCategories';
import { PageHeader } from './common/PageHeader';
import { ErrorDisplay } from './common/ErrorDisplay';
import { SearchBar } from './common/SearchBar';
import { DataStateDisplay } from './common/DataStateDisplay';

interface Props {
    mainCategoryId: string;
    onSelectSubCategory: (id: string) => void;
    onBack: () => void;
}

const SubCategories: React.FC<Props> = ({ mainCategoryId, onSelectSubCategory, onBack }) => {
    // State
    const [selectedCategoryId, setSelectedCategoryId] = useState(mainCategoryId);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editSubCategory, setEditSubCategory] = useState<ISubCategory | null>(null);
    const [englishName, setEnglishName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [dialogSelectedCategoryId, setDialogSelectedCategoryId] = useState('');

    // Hooks
    const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
    const { data: subCategories = [], isLoading: subCategoriesLoading, error: subCategoriesError } = useSubCategories(selectedCategoryId);
    const { create, update, remove } = useSubCategoryMutations();

    // Derived State
    const [filteredSubCategories, setFilteredSubCategories] = useState<ISubCategory[]>([]);

    useEffect(() => {
        const filtered = subCategories.filter(subCategory =>
            subCategory.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subCategory.arabicName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSubCategories(filtered);
    }, [searchQuery, subCategories]);

    useEffect(() => {
        // Update dialog selection defaults when page selection changes
        if (!dialogOpen) {
            setDialogSelectedCategoryId(selectedCategoryId || '');
        }
    }, [selectedCategoryId, dialogOpen]);


    const handleOpenDialog = (subCategory?: ISubCategory) => {
        setEditSubCategory(subCategory || null);
        setEnglishName(subCategory?.englishName || '');
        setArabicName(subCategory?.arabicName || '');
        // Default to current category or first available
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
        if (editSubCategory && editSubCategory._id) {
            await update.mutateAsync({ id: editSubCategory._id, data: { englishName, arabicName } });
        } else {
            await create.mutateAsync({ categoryId: dialogSelectedCategoryId, data: { englishName, arabicName } });
        }
        handleCloseDialog();
    };

    const handleDelete = async (subCategoryId: string) => {
        if (!window.confirm('Are you sure you want to delete this sub-category?')) return;
        await remove.mutateAsync(subCategoryId);
    };

    const getSelectedCategoryName = () => {
        const category = categories.find(cat => cat._id === selectedCategoryId);
        return category ? `${category.englishName} / ${category.arabicName}` : 'Select Category';
    };

    const mutationError = create.error || update.error || remove.error;
    const errorMessage = mutationError ? (mutationError as any).response?.data?.message || mutationError.message : null;
    const fetchError = (categoriesError as any)?.message || (subCategoriesError as any)?.message;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <PageHeader
                title="Sub-Categories"
                subtitle="Manage and organize sub-categories"
                icon={<IconButton onClick={onBack} sx={{ color: 'white' }}><ArrowBackIcon /></IconButton>}
                actionButtonText="Add Sub-Category"
                onAction={() => handleOpenDialog()}
            />

            <ErrorDisplay error={errorMessage || fetchError} />

            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'rgba(245, 245, 245, 0.5)' }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search sub-categories by name..."
                    />

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
                                value={selectedCategoryId || ''}
                                label="Category"
                                onChange={e => setSelectedCategoryId(e.target.value)}
                                sx={{ borderRadius: 2, backgroundColor: 'white' }}
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

            {filteredSubCategories.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {filteredSubCategories.length} sub-categor{filteredSubCategories.length !== 1 ? 'ies' : 'y'} found
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategoryId && ` in ${getSelectedCategoryName()}`}
                    </Typography>
                </Box>
            )}

            <DataStateDisplay
                loading={categoriesLoading || subCategoriesLoading}
                empty={filteredSubCategories.length === 0}
                emptyIcon={<FolderIcon />}
                emptyTitle="No sub-categories found"
                emptyMessage={
                    searchQuery
                        ? `No sub-categories match "${searchQuery}"`
                        : selectedCategoryId
                            ? 'No sub-categories available for the selected category'
                            : 'Please select a category to view sub-categories'
                }
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
                                onClick={() => subCategory._id && onSelectSubCategory(subCategory._id)}
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
                                            <FolderIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="h6" fontWeight="700" noWrap>
                                                {subCategory.englishName || 'Unnamed'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {subCategory.arabicName || 'بدون اسم'}
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
                                                    if (subCategory._id) handleDelete(subCategory._id);
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
                <DialogTitle>{editSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="dialog-category-label">Category</InputLabel>
                            <Select
                                labelId="dialog-category-label"
                                value={dialogSelectedCategoryId}
                                label="Category"
                                onChange={(e) => setDialogSelectedCategoryId(e.target.value)}
                                disabled={!!editSubCategory}
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
                        disabled={create.isPending || update.isPending || !englishName.trim() || !arabicName.trim() || !dialogSelectedCategoryId}
                    >
                        {create.isPending || update.isPending ? 'Saving...' : (editSubCategory ? 'Update' : 'Add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SubCategories;
