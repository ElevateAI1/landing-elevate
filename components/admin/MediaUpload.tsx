import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, FileVideo } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

interface MediaUploadProps {
  currentMedia?: string;
  currentMediaType?: 'image' | 'video';
  onMediaChange: (url: string, type: 'image' | 'video') => void;
  folder: string;
  label?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  currentMedia,
  currentMediaType,
  onMediaChange,
  folder,
  label = 'Media (Imagen o Video)'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentMedia || null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(currentMediaType || 'image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determinar tipo de archivo
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      alert('Por favor selecciona un archivo de imagen o video válido');
      return;
    }

    // Validar tamaño (max 50MB para videos, 5MB para imágenes)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`El archivo debe ser menor a ${isVideo ? '50MB' : '5MB'}`);
      return;
    }

    // Crear preview local
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setMediaType('image');
      };
      reader.readAsDataURL(file);
    } else {
      // Para videos, crear URL de objeto
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);
      setMediaType('video');
    }

    // Subir a Supabase (solo imágenes por ahora, videos se pueden subir manualmente)
    if (isImage) {
      setUploading(true);
      try {
        const url = await uploadImage(file, folder);
        if (url) {
          onMediaChange(url, 'image');
          setPreview(url);
        } else {
          alert('❌ Error al subir la imagen.\n\nVerifica:\n1. Que el bucket "images" exista en Supabase Storage\n2. Que el bucket sea público\n3. Que las políticas de Storage estén configuradas\n\nRevisa la consola para más detalles.');
          setPreview(currentMedia || null);
        }
      } catch (error: any) {
        console.error('Error uploading image:', error);
        alert(`❌ Error al subir la imagen: ${error?.message || 'Error desconocido'}\n\nRevisa la consola para más detalles.`);
        setPreview(currentMedia || null);
      } finally {
        setUploading(false);
      }
    } else {
      // Para videos, solo mostrar preview, el usuario debe subir manualmente
      alert('Para videos, por favor sube el archivo a un servicio de hosting (YouTube, Vimeo, etc.) y pega la URL en el campo de abajo.');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setMediaType('image');
    onMediaChange('', 'image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 uppercase">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 border border-emerald-500/30 bg-black/50 overflow-hidden">
            {mediaType === 'video' ? (
              <video
                src={preview}
                className="w-full h-full object-cover"
                controls={false}
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-900/80 hover:bg-red-700 text-white p-1 rounded"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-1 left-1 bg-emerald-900/80 px-2 py-1 rounded text-xs text-emerald-400 font-mono">
              {mediaType.toUpperCase()}
            </div>
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
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`media-upload-${folder}`}
          />
          <label
            htmlFor={`media-upload-${folder}`}
            className={`inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-500 cursor-pointer hover:bg-emerald-500/10 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload size={16} />
            {uploading ? 'Subiendo...' : preview ? 'Cambiar Media' : 'Subir Imagen/Video'}
          </label>
          {preview && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Tipo:</label>
                <select
                  className="bg-transparent border border-gray-700 p-1 text-white text-xs focus:border-emerald-500 outline-none"
                  value={mediaType}
                  onChange={(e) => {
                    const newType = e.target.value as 'image' | 'video';
                    setMediaType(newType);
                    onMediaChange(preview, newType);
                  }}
                >
                  <option value="image">Imagen</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <input
                type="text"
                value={preview}
                onChange={(e) => {
                  let url = e.target.value;
                  let type = mediaType;
                  
                  // Detectar tipo automáticamente si es URL de video
                  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
                    type = 'video';
                    setMediaType('video');
                  } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
                    type = 'image';
                    setMediaType('image');
                  } else if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
                    type = 'video';
                    setMediaType('video');
                  }
                  
                  setPreview(url);
                  onMediaChange(url, type);
                }}
                placeholder="O pega una URL de imagen/video (YouTube, Vimeo, etc.)"
                className="w-full bg-transparent border-b border-gray-700 p-2 text-white text-xs focus:border-emerald-500 outline-none"
              />
              <p className="text-xs text-gray-500">O ingresa una URL manualmente (YouTube, Vimeo, imagen directa, etc.)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

