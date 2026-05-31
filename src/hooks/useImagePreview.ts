import { useCallback, useEffect, useRef, useState } from 'react';

interface UseImagePreviewReturn {
  previewUrl: string | undefined;
  setFile: (file: File) => void;
  clear: () => void;
}

/**
 * Manages an object URL preview for a File, automatically revoking
 * the previous URL to prevent memory leaks.
 */
export function useImagePreview(): UseImagePreviewReturn {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const currentUrlRef = useRef<string | undefined>(undefined);

  const revoke = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = undefined;
    }
  }, []);

  const setFile = useCallback(
    (file: File) => {
      revoke();
      const url = URL.createObjectURL(file);
      currentUrlRef.current = url;
      setPreviewUrl(url);
    },
    [revoke],
  );

  const clear = useCallback(() => {
    revoke();
    setPreviewUrl(undefined);
  }, [revoke]);

  useEffect(() => {
    return revoke;
  }, [revoke]);

  return { previewUrl, setFile, clear };
}
