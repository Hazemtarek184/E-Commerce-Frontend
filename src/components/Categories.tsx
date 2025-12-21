import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getCategories();
            console.log('Categories API response:', res.data);
            const apiCategories = res.data?.data?.categories;
            if (res.data && res.data.success && Array.isArray(apiCategories)) {
                setCategories(apiCategories);
            } else {
                setCategories([]);
                setError(res.data?.error || 'Failed to fetch categories');
            }
        } catch (err: any) {
            setCategories([]);
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Categories</Typography>
                <Button variant="contained" onClick={() => handleOpenDialog()}>Add Category</Button>
            </Box>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : loading ? (
                <CircularProgress />
            ) : !Array.isArray(categories) || categories.length === 0 ? (
                <Typography>No categories found.</Typography>
            ) : (
                <List>
                    {categories.map((cat) => (
                        <ListItem
                            key={cat._id}
                            disablePadding
                            secondaryAction={
                                <>
                                    <IconButton edge="end" onClick={e => { e.stopPropagation(); handleOpenDialog(cat); }}><EditIcon /></IconButton>
                                    <IconButton edge="end" onClick={e => { e.stopPropagation(); handleDelete(cat._id!); }}><DeleteIcon /></IconButton>
                                </>
                            }
                        >
                            <ListItemButton onClick={() => onSelectCategory(cat._id!)}>
                                <ListItemText
                                    primary={cat.englishName}
                                    secondary={cat.arabicName}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="English Name"
                        fullWidth
                        value={englishName}
                        onChange={e => setEnglishName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Arabic Name"
                        fullWidth
                        value={arabicName}
                        onChange={e => setArabicName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories; 