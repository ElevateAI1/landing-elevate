import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  folder: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  folder,
  label = 'Imagen'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    // Crear preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Supabase
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      if (url) {
        onImageChange(url);
        setPreview(url);
      } else {
        alert('Error al subir la imagen. Intenta de nuevo.');
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 uppercase">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 border border-emerald-500/30 bg-black/50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-900/80 hover:bg-red-700 text-white p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 border border-dashed border-gray-700 flex items-center justify-center bg-black/20">
            <ImageIcon size={32} className="text-gray-600" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`image-upload-${folder}`}
          />
          <label
            htmlFor={`image-upload-${folder}`}
            className={`inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-500 cursor-pointer hover:bg-emerald-500/10 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload size={16} />
            {uploading ? 'Subiendo...' : preview ? 'Cambiar Imagen' : 'Subir Imagen'}
          </label>
          {preview && (
            <div className="mt-2">
              <input
                type="text"
                value={preview}
                onChange={(e) => {
                  setPreview(e.target.value);
                  onImageChange(e.target.value);
                }}
                placeholder="O pega una URL"
                className="w-full bg-transparent border-b border-gray-700 p-2 text-white text-xs focus:border-emerald-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">O ingresa una URL manualmente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

