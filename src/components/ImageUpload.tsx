import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 15,
  maxSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      // Проверяем, существует ли bucket
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError(`Ошибка загрузки: ${uploadError.message}`);
        return null;
      }

      console.log('File uploaded successfully:', filePath);
      
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Ошибка при загрузке изображения');
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null);
    console.log('Processing files:', files.length);
    
    if (images.length + files.length > maxImages) {
      setError(`Максимум ${maxImages} изображений`);
      return;
    }

    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        setError('Можно загружать только изображения');
        continue;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Размер файла не должен превышать ${maxSizeMB}MB`);
        continue;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = validFiles.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUploads.length > 0) {
        onImagesChange([...images, ...successfulUploads]);
        console.log('Successfully uploaded:', successfulUploads.length, 'images');
      }
      
      if (successfulUploads.length < validFiles.length) {
        setError('Некоторые изображения не удалось загрузить');
      }
    } catch (error) {
      setError('Ошибка при загрузке изображений');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange, maxImages, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Изображения ({images.length}/{maxImages})
      </label>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading || images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
          disabled={uploading || images.length >= maxImages}
        />
        
        <label
          htmlFor="image-upload"
          className={`${uploading || images.length >= maxImages ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-col items-center space-y-2`}
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            {uploading ? (
              <span>Загрузка...</span>
            ) : images.length >= maxImages ? (
              <span>Достигнут лимит изображений</span>
            ) : (
              <>
                <span className="font-medium text-blue-600">Нажмите для выбора</span>
                <span> или перетащите изображения сюда</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">
            PNG, JPG до {maxSizeMB}MB (максимум {maxImages} файлов)
          </div>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;