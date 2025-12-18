import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Data will not persist.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para subir imágenes
export const uploadImage = async (file: File, folder: string): Promise<string | null> => {
  if (!supabase) {
    console.error('❌ Supabase no está configurado. Verifica las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        console.error('❌ Error: El bucket "images" no existe en Supabase Storage.');
        console.error('📝 Solución: Ve a Supabase → Storage → Crea un bucket llamado "images" y márcalo como público.');
      } else {
        console.error('❌ Error al subir imagen:', error.message);
      }
      return null;
    }

    if (!data) {
      console.error('❌ No se recibieron datos al subir la imagen');
      return null;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    console.log('✅ Imagen subida exitosamente:', publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error('❌ Error inesperado al subir imagen:', error?.message || error);
    return null;
  }
};

