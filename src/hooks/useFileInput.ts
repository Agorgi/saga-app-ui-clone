import type React from 'react';
import { useCallback, useId, useRef } from 'react';

interface UseFileInputOptions {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: FileList) => void;
}

interface UseFileInputReturn {
  /** Call to programmatically open the file picker */
  openFilePicker: () => void;
  /** Props to spread onto a hidden <input type="file"> */
  inputProps: {
    ref: React.RefObject<HTMLInputElement | null>;
    id: string;
    type: 'file';
    accept: string | undefined;
    multiple: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style: React.CSSProperties;
  };
  /** Reset the input value so the same file can be re-selected */
  reset: () => void;
}

/**
 * Encapsulates the hidden file-input + ref + click pattern
 * that is repeated across upload components.
 */
export function useFileInput({
  accept,
  multiple = false,
  onFiles,
}: UseFileInputOptions): UseFileInputReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const onFilesRef = useRef(onFiles);
  onFilesRef.current = onFiles;

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      onFilesRef.current(files);
    }
  }, []);

  const reset = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return {
    openFilePicker,
    inputProps: {
      ref: inputRef,
      id: inputId,
      type: 'file' as const,
      accept,
      multiple,
      onChange: handleChange,
      style: { display: 'none' },
    },
    reset,
  };
}
