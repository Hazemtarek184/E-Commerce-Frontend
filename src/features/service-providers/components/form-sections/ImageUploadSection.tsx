import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { UseFormReturn } from 'react-hook-form';
import imageCompression from 'browser-image-compression';

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
          // Configuration for compression
          // Vercel limit is 4.5MB total. If 10 images, avg 0.45MB each.
          // We target ~0.4MB per image to be safe.
          const options = {
            maxSizeMB: 0.4, 
            maxWidthOrHeight: 1200, // Reasonable size for web display
            useWebWorker: true,
            fileType: 'image/jpeg'
          };
          try {
             return await imageCompression(file, options);
          } catch (error) {
            console.error("Compression failed for file:", file.name, error);
            return file; // Fallback to original if compression fails
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

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Images
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {existingImages.map((img) => (
          <Box
            key={img.public_id}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
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
                bgcolor: 'rgba(0,0,0,0.5)',
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
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        {previewUrls.map((url, index) => (
          <Box
            key={url}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
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
                bgcolor: 'rgba(0,0,0,0.5)',
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
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Box
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            border: '2px dashed #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isCompressing ? 'default' : 'pointer',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          {isCompressing ? (
             <CircularProgress size={24} />
          ) : (
             <AddIcon fontSize="large" color="action" />
          )}
        </Box>
      </Box>

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
    </Box>
  );
};
