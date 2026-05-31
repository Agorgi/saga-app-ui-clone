import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseGeneratePostModalHandlersOptions {
  preserveParams?: string[];
}

export const useGeneratePostModalHandlers = (options: UseGeneratePostModalHandlersOptions = {}) => {
  const { preserveParams = [] } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);

      for (const param of preserveParams) {
        const value = searchParams.get(param);
        if (value) {
          newParams.set(param, value);
        }
      }

      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, preserveParams],
  );

  const openPostModal = useCallback(
    (postId: string) => {
      updateSearchParams({ post: postId });
    },
    [updateSearchParams],
  );

  const closePostModal = useCallback(() => {
    updateSearchParams({ post: null });
  }, [updateSearchParams]);

  return {
    openPostModal,
    closePostModal,
  };
};
