import React, { useMemo, useState } from 'react';
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
  Typography,
  Chip,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

  // Memoized filtered categories
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (category) =>
        category.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.arabicName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
  const errorMessage = mutationError
    ? (mutationError as any).response?.data?.message || mutationError.message
    : null;
  const fetchError = queryError ? (queryError as any).message : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeader
        title="Categories"
        subtitle="Manage your main service categories"
        icon={<CategoryIcon />}
        actionButtonText="Add Category"
        onAction={() => handleOpenDialog()}
      />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <ErrorDisplay error={errorMessage || fetchError} />

        <Box mb={4}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search categories..."
          />
        </Box>

        <DataStateDisplay
          loading={isLoading}
          empty={filteredCategories.length === 0}
          emptyIcon={<CategoryIcon />}
          emptyTitle="No categories found"
          emptyMessage={
            searchQuery
              ? `No categories match "${searchQuery}"`
              : 'Get started by adding a category'
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
            {filteredCategories.map((cat) => (
              <Card
                key={cat._id}
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
                onClick={() => cat._id && onSelectCategory(cat._id)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha('#6366f1', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      <CategoryIcon />
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
                          handleOpenDialog(cat);
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
                          if (cat._id) handleDelete(cat._id);
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
                    {cat.englishName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {cat.arabicName}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={`${cat.subCategories?.length || 0} subcategories`}
                      size="small"
                      sx={{ bgcolor: alpha('#6366f1', 0.1), color: 'primary.main' }}
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
          {editCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              autoFocus
              label="English Name"
              fullWidth
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="Enter category name in English"
            />
            <TextField
              label="Arabic Name"
              fullWidth
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              placeholder="أدخل اسم الفئة بالعربية"
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
            disabled={!englishName || !arabicName || create.isPending || update.isPending}
          >
            {create.isPending || update.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
