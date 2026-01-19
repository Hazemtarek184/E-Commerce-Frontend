import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, alpha } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import type { UseFormReturn } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import { FormSection } from './FormSection';

interface ImageUploadSectionProps {
  form: UseFormReturn<any>;
  defaultImages?: any[];
  isEdit?: boolean;
  onDeleteExisting?: (publicId: string) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  form,
  defaultImages = [],
  onDeleteExisting
}) => {
  const [existingImages, setExistingImages] = useState(defaultImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleDeleteExisting = (publicId: string) => {
    if (onDeleteExisting) onDeleteExisting(publicId);
    setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsCompressing(true);
      const originalFiles = Array.from(event.target.files);
      
      try {
        const compressedFilesPromises = originalFiles.map(async (file) => {
          const options = {
            maxSizeMB: 0.4, 
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: 'image/jpeg'
          };
          try {
             return await imageCompression(file, options);
          } catch (error) {
            console.error("Compression failed for file:", file.name, error);
            return file;
          }
        });

        const compressedFiles = await Promise.all(compressedFilesPromises);

        const updatedFiles = [...newImages, ...compressedFiles];
        setNewImages(updatedFiles);

        const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);

        form.setValue('image', updatedFiles, { shouldValidate: true });
      } catch (error) {
        console.error("Error handling file selection:", error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    form.setValue('image', updatedImages, { shouldValidate: true });
  };

  const error = form.formState.errors.image?.message as string | undefined;
  const totalImages = existingImages.length + previewUrls.length;

  return (
    <FormSection title="Images" icon={<ImageIcon fontSize="small" />}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {existingImages.map((img) => (
          <Box
            key={img.public_id}
            sx={{
              position: 'relative',
              width: 88,
              height: 88,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover .delete-overlay': { opacity: 1 },
            }}
          >
            <img
              src={img.url}
              alt="Existing"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              className="delete-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: (theme) => alpha(theme.palette.common.black, 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => handleDeleteExisting(img.public_id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        {previewUrls.map((url, index) => (
          <Box
            key={url}
            sx={{
              position: 'relative',
              width: 88,
              height: 88,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover .delete-overlay': { opacity: 1 },
            }}
          >
            <img
              src={url}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              className="delete-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: (theme) => alpha(theme.palette.common.black, 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <IconButton
                size="small"
                sx={{ color: 'white' }}
                onClick={() => handleRemoveNewImage(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          sx={{
            width: 88,
            height: 88,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isCompressing ? 'default' : 'pointer',
            transition: 'all 0.2s',
            bgcolor: 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          {isCompressing ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <AddPhotoAlternateIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Add
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {totalImages > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          {totalImages} image{totalImages !== 1 ? 's' : ''} selected
        </Typography>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </FormSection>
  );
};
