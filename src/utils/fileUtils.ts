// Wireframe subset of the production fileUtils. Only `validateImage` is used by
// the profile edit components (EditableBanner, EditableProfilePicture). The
// upload/read/thumbnail helpers are dropped along with their backend wiring, and
// the size limit is inlined here instead of read from `@saga/config-web`
// `constants` (which the clone's config shim does not provide).

interface ValidateImageOptions {
  MAX_SIZE_BYTES?: number;
  allowSvg?: boolean;
}

const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Validates a file is a valid image (type, size, SVG check).
 * Returns an error message string if invalid, or `undefined` if valid.
 * Does NOT show toasts — callers decide how to surface errors.
 */
export function validateImage(file: File, options?: ValidateImageOptions): string | undefined {
  const MAX_SIZE_BYTES = options?.MAX_SIZE_BYTES ?? DEFAULT_MAX_SIZE_BYTES;
  const allowSvg = options?.allowSvg ?? false;

  if (!file.type.startsWith('image/')) {
    return 'Please upload an image file';
  }

  if (!allowSvg && file.type === 'image/svg+xml') {
    return 'SVG files are not supported. Please upload PNG, JPG, or other image formats.';
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `Image size must be less than ${MAX_SIZE_BYTES / (1024 * 1024)}MB`;
  }

  return undefined;
}

/**
 * Reads a File as a base64 data URL. Used by the crowd-commission wizard to preview a
 * hero / poll-option image locally. No upload happens in the clone; the data URL stays
 * in component state. Mirrors the production helper's signature.
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
