import React, { useMemo, useState, useEffect } from 'react';
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
  Chip,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

  // Memoized filtered categories
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (subCategory) =>
        subCategory.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subCategory.arabicName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subCategories]);

  useEffect(() => {
    if (!dialogOpen) {
      setDialogSelectedCategoryId(selectedCategoryId || '');
    }
  }, [selectedCategoryId, dialogOpen]);

  const handleOpenDialog = (subCategory?: ISubCategory) => {
    setEditSubCategory(subCategory || null);
    setEnglishName(subCategory?.englishName || '');
    setArabicName(subCategory?.arabicName || '');
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
    if (!window.confirm('Delete this sub-category?')) return;
    await remove.mutateAsync(subCategoryId);
  };

  const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId);

  const mutationError = create.error || update.error || remove.error;
  const errorMessage = mutationError
    ? (mutationError as any).response?.data?.message || mutationError.message
    : null;
  const fetchError = (categoriesError as any)?.message || (subCategoriesError as any)?.message;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader
        title="Sub-Categories"
        subtitle={selectedCategory ? `In ${selectedCategory.englishName}` : 'Manage sub-categories'}
        icon={<FolderIcon />}
        actionButtonText="Add Sub-Category"
        onAction={() => handleOpenDialog()}
        backButton={
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        }
      />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <ErrorDisplay error={errorMessage || fetchError} />

        {/* Filters */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sub-categories..."
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId || ''}
              label="Category"
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              sx={{ bgcolor: 'background.paper' }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.englishName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <DataStateDisplay
          loading={categoriesLoading || subCategoriesLoading}
          empty={filteredSubCategories.length === 0}
          emptyIcon={<FolderIcon />}
          emptyTitle="No sub-categories found"
          emptyMessage={
            searchQuery
              ? `No sub-categories match "${searchQuery}"`
              : selectedCategoryId
              ? 'No sub-categories in this category yet'
              : 'Select a category to view sub-categories'
          }
          onClearSearch={searchQuery ? () => setSearchQuery('') : undefined}
        >
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {filteredSubCategories.map((subCategory) => (
              <Card
                key={subCategory._id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    '& .action-buttons': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => subCategory._id && onSelectSubCategory(subCategory._id)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha('#8b5cf6', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'secondary.main',
                        mb: 2,
                      }}
                    >
                      <FolderIcon />
                    </Box>
                    <Box
                      className="action-buttons"
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(subCategory);
                        }}
                        sx={{
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (subCategory._id) handleDelete(subCategory._id);
                        }}
                        sx={{
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {subCategory.englishName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {subCategory.arabicName}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={`${subCategory.serviceProvider?.length || 0} providers`}
                      size="small"
                      sx={{ bgcolor: alpha('#8b5cf6', 0.1), color: 'secondary.main' }}
                    />
                    <ArrowForwardIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DataStateDisplay>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {editSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={dialogSelectedCategoryId}
                label="Category"
                onChange={(e) => setDialogSelectedCategoryId(e.target.value)}
                disabled={!!editSubCategory}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.englishName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              label="English Name"
              fullWidth
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="Enter name in English"
            />
            <TextField
              label="Arabic Name"
              fullWidth
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              placeholder="أدخل الاسم بالعربية"
              dir="rtl"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              create.isPending ||
              update.isPending ||
              !englishName.trim() ||
              !arabicName.trim() ||
              !dialogSelectedCategoryId
            }
          >
            {create.isPending || update.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubCategories;
