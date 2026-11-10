import { supabase } from './supabase';

const BUCKET = 'chat-photos';
const MAX_BYTES = 5 * 1024 * 1024;
const SIGNED_URL_SECONDS = 300;
const TYPE_EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export const PHOTO_ACCEPT = Object.keys(TYPE_EXTENSIONS).join(',');

export function validatePhoto(file) {
  if (!TYPE_EXTENSIONS[file.type]) return 'Solo se admiten fotos JPG, PNG o WebP.';
  if (file.size > MAX_BYTES) return 'La foto no puede pesar más de 5 MB.';
  return null;
}

export async function uploadPhoto(userId, file) {
  const path = `${userId}/${crypto.randomUUID()}.${TYPE_EXTENSIONS[file.type]}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  return error ? null : path;
}

export async function getPhotoUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
  return error || !data?.signedUrl ? null : data.signedUrl;
}

export async function removePhoto(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}
